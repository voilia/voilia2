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
  isPending?: boolean;
  transaction_id?: string;
  messageType?: 'user' | 'agent';
}

export function useRoomMessages(roomId: string | undefined) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!roomId || !user) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("room_messages")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        setMessages(currentMessages => {
          const pendingMessages = currentMessages.filter(msg => msg.isPending);
          
          const combinedMessages = [...(data || [])];
          
          pendingMessages.forEach(pendingMsg => {
            const existsInData = data?.some(dbMsg => 
              dbMsg.transaction_id === pendingMsg.transaction_id
            );
            
            if (!existsInData) {
              combinedMessages.push(pendingMsg);
            }
          });
          
          return combinedMessages;
        });
      } catch (err) {
        console.error("Error fetching room messages:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

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
          console.log("New message from realtime:", payload.new);
          const newMessage = payload.new as RoomMessage;
          
          setMessages((prev) => {
            const pendingIndex = prev.findIndex(msg => 
              msg.isPending && 
              msg.transaction_id === newMessage.transaction_id
            );
            
            if (pendingIndex >= 0) {
              const updatedMessages = [...prev];
              updatedMessages[pendingIndex] = newMessage;
              return updatedMessages;
            }
            
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      console.log("Removing channel for room:", roomId);
      supabase.removeChannel(channel);
    };
  }, [roomId, user?.id, user]);

  const addLocalMessage = (message: RoomMessage) => {
    console.log("Adding local message:", message);
    setMessages(prev => {
      const exists = prev.some(m => 
        m.transaction_id === message.transaction_id && 
        m.messageType === message.messageType
      );
      
      if (exists) {
        console.log("Message already exists, not adding duplicate");
        return prev;
      }
      
      return [...prev, message];
    });
  };

  const sendMessage = async (text: string, transactionId?: string) => {
    if (!roomId || !text.trim() || !user) {
      if (!user && !authLoading) {
        toast.error("Authentication required", {
          description: "Please log in to send messages"
        });
      }
      return;
    }

    const msgTransactionId = transactionId || uuidv4();

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

    addLocalMessage(optimisticMessage);

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
      
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      
      toast.error("Failed to send message");
      throw err;
    }
  };

  return {
    messages,
    isLoading: isLoading || authLoading,
    error,
    sendMessage,
    addLocalMessage,
  };
}
