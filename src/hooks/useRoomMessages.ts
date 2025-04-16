
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string | null;
  agent_id: string | null;
  message_text: string | null;
  created_at: string;
  updated_at: string | null;
}

export function useRoomMessages(roomId: string | undefined) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Function to send a new message
  const sendMessage = async (text: string) => {
    if (!roomId || !text.trim()) return;

    try {
      const { error } = await supabase
        .from("room_messages")
        .insert({
          room_id: roomId,
          message_text: text,
          // user_id is automatically set by RLS
        });

      if (error) throw error;
    } catch (err) {
      console.error("Error sending message:", err);
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
