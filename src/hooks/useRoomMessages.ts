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
    console.log("Handling new/updated message:", message);
    
    setMessages(prev => {
      // Check if there's a pending message with the same transaction ID
      const pendingIndex = prev.findIndex(msg => 
        msg.transaction_id === message.transaction_id
      );
      
      if (pendingIndex >= 0) {
        console.log("Updating existing pending message:", prev[pendingIndex].id, "->", message.id);
        
        // Update existing message, preserving order
        const updatedMessages = [...prev];
        updatedMessages[pendingIndex] = {
          ...message,
          messageType: message.user_id === null ? 'agent' as const : 'user' as const,
          isPending: false // Make sure to remove the pending flag
        };
        return updatedMessages;
      }
      
      // Check if message already exists to avoid duplicates
      const exists = prev.some(msg => 
        msg.id === message.id || 
        msg.transaction_id === message.transaction_id
      );
      
      if (exists) {
        console.log("Ignoring duplicate message:", message.id);
        return prev;
      }
      
      console.log("Adding new message to state:", message.id);
      // Add new message and maintain chronological order
      return [...prev, {
        ...message,
        messageType: message.user_id === null ? 'agent' as const : 'user' as const,
        isPending: false // Make sure this is not pending
      }].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, []);

  useRoomMessageSubscription(roomId, handleNewMessage);

  const addLocalMessage = useCallback((message: RoomMessage) => {
    console.log("Adding local message:", message);
    setMessages(prev => {
      const messageWithTransaction = {
        ...message,
        transaction_id: message.transaction_id || `local-${message.id}`
      };
      
      // Check if a message with this transaction ID already exists
      const exists = prev.some(m => 
        m.id === messageWithTransaction.id || 
        m.transaction_id === messageWithTransaction.transaction_id
      );
      
      if (exists) {
        console.log("Local message already exists, not adding duplicate:", messageWithTransaction.id);
        return prev;
      }
      
      console.log("Adding local message to state:", messageWithTransaction.id);
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
          messageType: msg.user_id === null ? 'agent' as const : 'user' as const,
          isPending: false // Ensure database messages are never pending
        }));
        
        console.log(`Fetched ${dbMessages.length} messages from DB, have ${pendingMessages.length} pending messages`);
        
        const combinedMessages = [...dbMessages];
        
        // Only keep pending messages that aren't already in the database
        pendingMessages.forEach(pendingMsg => {
          if (!pendingMsg.transaction_id) return;
          
          const existsInData = dbMessages.some(dbMsg => 
            dbMsg.transaction_id === pendingMsg.transaction_id
          );
          
          if (!existsInData) {
            console.log("Keeping pending message not in DB:", pendingMsg.id);
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
      user_id: null, // This will be set by the backend
      agent_id: null,
      message_text: text,
      created_at: new Date().toISOString(),
      updated_at: null,
      isPending: true,
      transaction_id: optimisticId,
      messageType: "user" as const
    };

    addLocalMessage(optimisticMessage);

    try {
      const transactionId = await persistMessage(text, optimisticMessage.user_id);
      if (transactionId) {
        // Update the transaction ID in our local state to match what was sent to the server
        setMessages(prev => {
          const updatedMessages = prev.map(msg => {
            if (msg.id === optimisticId) {
              return {
                ...msg,
                transaction_id: transactionId
              };
            }
            return msg;
          });
          return updatedMessages;
        });
      }
      return transactionId;
    } catch (error) {
      // Remove the optimistic message on error
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
