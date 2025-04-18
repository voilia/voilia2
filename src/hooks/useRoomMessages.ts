
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
  transaction_id?: string; // Added to link messages in the same conversation
  messageType?: 'user' | 'agent'; // Added to clearly identify message types
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
          
          // Process incoming message
          setMessages((prev) => {
            // If this is a confirmed version of our optimistic message, replace it
            // We identify matching optimistic messages using combined criteria
            const pendingIndex = prev.findIndex(msg => 
              msg.isPending && 
              (msg.message_text === newMessage.message_text) && 
              // Match either by user_id directly or check if this is a user message that matches current user
              ((msg.user_id === newMessage.user_id) || 
               (msg.user_id === user?.id && newMessage.user_id === user?.id))
            );
            
            // If we found a matching pending message, replace it
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

  // Function to add a message locally without waiting for Supabase
  const addLocalMessage = (message: RoomMessage) => {
    setMessages(prev => [...prev, message]);
  };

  // Function to send a new message with optimistic updates and transaction ID
  const sendMessage = async (text: string, transactionId?: string) => {
    if (!roomId || !text.trim() || !user) return;

    // Generate transaction ID if not provided
    const msgTransactionId = transactionId || uuidv4();

    // Create optimistic message for immediate display
    const optimisticMessage: RoomMessage = {
      id: uuidv4(),
      room_id: roomId,
      user_id: user.id,
      agent_id: null,
      message_text: text,
      created_at: new Date().toISOString(),
      updated_at: null,
      isPending: true,
      transaction_id: msgTransactionId,
      messageType: 'user'
    };

    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const { error } = await supabase
        .from("room_messages")
        .insert({
          room_id: roomId,
          message_text: text,
          transaction_id: msgTransactionId
        });

      if (error) throw error;
      
      return msgTransactionId;
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
    addLocalMessage,
  };
}
