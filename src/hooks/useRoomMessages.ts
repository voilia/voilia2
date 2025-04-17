
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { v4 as uuidv4 } from 'uuid';

export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string | null;
  agent_id: string | null;
  message_text: string | null;
  created_at: string;
  updated_at: string | null;
  isPending?: boolean; // Added for optimistic updates
}

export function useRoomMessages(roomId: string | undefined) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!roomId) return;

    // Initial fetch of messages
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("room_messages")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        setMessages(data || []);
      } catch (err) {
        console.error("Error fetching room messages:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`room_${roomId}_messages`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as RoomMessage;
          
          // Only add server messages or replace pending messages with confirmed ones
          setMessages((prev) => {
            // If this is a confirmed version of our optimistic message, replace it
            const pendingIndex = prev.findIndex(msg => 
              msg.isPending && 
              msg.message_text === newMessage.message_text && 
              (msg.user_id === newMessage.user_id || (!msg.user_id && newMessage.user_id === user?.id))
            );
            
            if (pendingIndex >= 0) {
              const updatedMessages = [...prev];
              updatedMessages[pendingIndex] = newMessage;
              return updatedMessages;
            }
            
            // Otherwise, it's a new message from the server, add it
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, user?.id]);

  // Function to send a new message with optimistic updates
  const sendMessage = async (text: string) => {
    if (!roomId || !text.trim() || !user) return;

    // Create optimistic message for immediate display
    const optimisticMessage: RoomMessage = {
      id: uuidv4(), // Temporary ID
      room_id: roomId,
      user_id: user.id, // Make sure this is set to the current user's ID
      agent_id: null,
      message_text: text,
      created_at: new Date().toISOString(),
      updated_at: null,
      isPending: true
    };

    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const { error } = await supabase
        .from("room_messages")
        .insert({
          room_id: roomId,
          message_text: text,
          // user_id is automatically set by RLS
        });

      if (error) throw error;
      
      // No success toast needed since we're showing the message optimistically
    } catch (err) {
      console.error("Error sending message:", err);
      
      // On error, remove the optimistic message
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      
      // Show error toast
      toast.error("Failed to send message");
      throw err;
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}
