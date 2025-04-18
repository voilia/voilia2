
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomMessage } from "@/types/room-messages";
import { useMessagePersistence } from "@/services/messages/useMessagePersistence";
import { useRoomMessageSubscription } from "@/hooks/useRoomMessageSubscription";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export function useRoomMessages(roomId: string | undefined) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { sendMessage: persistMessage, isProcessing } = useMessagePersistence(roomId);
  
  const handleNewMessage = useCallback((message: RoomMessage) => {
    setMessages(prev => {
      // Find if there's a pending message with the same transaction ID
      const pendingIndex = prev.findIndex(msg => 
        msg.transaction_id === message.transaction_id
      );
      
      if (pendingIndex >= 0) {
        const updatedMessages = [...prev];
        updatedMessages[pendingIndex] = {
          ...message,
          messageType: message.user_id === null ? 'agent' as const : 'user' as const,
          isPending: false
        };
        return updatedMessages;
      }
      
      // Check if message already exists to avoid duplicates
      const exists = prev.some(msg => 
        msg.id === message.id || 
        msg.transaction_id === message.transaction_id
      );
      
      if (exists) return prev;
      
      // Add the new message and sort by creation time
      return [...prev, {
        ...message,
        messageType: message.user_id === null ? 'agent' as const : 'user' as const
      }].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, []);

  useRoomMessageSubscription(roomId, handleNewMessage);

  const addLocalMessage = useCallback((message: RoomMessage) => {
    console.log("Adding local message:", message);
    const messageWithTransaction = {
      ...message,
      transaction_id: message.transaction_id || `local-${message.id}`
    };
    
    setMessages(prev => {
      const exists = prev.some(m => 
        m.id === messageWithTransaction.id || 
        m.transaction_id === messageWithTransaction.transaction_id
      );
      
      if (exists) return prev;
      
      return [...prev, messageWithTransaction].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!roomId) return;

    try {
      setIsLoading(true);
      console.log("Fetching messages for room:", roomId);
      
      const { data, error } = await supabase
        .from("room_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) throw error;
        
      setMessages(currentMessages => {
        const pendingMessages = currentMessages.filter(msg => msg.isPending);
        const dbMessages = (data || []).map(msg => ({
          ...msg,
          transaction_id: msg.transaction_id || `db-${msg.id}`,
          messageType: msg.user_id === null ? 'agent' as const : 'user' as const
        }));
        
        const combinedMessages = [...dbMessages];
        pendingMessages.forEach(pendingMsg => {
          if (!pendingMsg.transaction_id) return;
          
          const existsInData = dbMessages.some(dbMsg => 
            dbMsg.transaction_id === pendingMsg.transaction_id
          );
          
          if (!existsInData) {
            combinedMessages.push(pendingMsg);
          }
        });
        
        return combinedMessages.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
    } catch (err) {
      console.error("Error fetching room messages:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!roomId || !text.trim()) return;

    const optimisticId = uuidv4();
    const optimisticMessage: RoomMessage = {
      id: optimisticId,
      room_id: roomId,
      user_id: null,
      agent_id: null,
      message_text: text,
      created_at: new Date().toISOString(),
      updated_at: null,
      isPending: true,
      transaction_id: optimisticId,
      messageType: "user"
    };

    addLocalMessage(optimisticMessage);

    try {
      const transactionId = await persistMessage(text, optimisticMessage.user_id);
      if (transactionId) {
        optimisticMessage.transaction_id = transactionId;
      }
      return transactionId;
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== optimisticId));
      throw error;
    }
  }, [roomId, persistMessage, addLocalMessage]);

  const refetchMessages = useCallback(() => {
    console.log("Force refreshing messages for room:", roomId);
    fetchMessages();
  }, [fetchMessages, roomId]);

  return {
    messages,
    isLoading: isLoading || isProcessing,
    error,
    sendMessage,
    addLocalMessage,
    refetchMessages,
  };
}
