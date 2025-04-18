
import { useEffect, useCallback } from "react";
import { RoomMessage } from "@/types/room-messages";
import { useMessagePersistence } from "@/services/messages/useMessagePersistence";
import { useRoomMessageSubscription } from "@/hooks/useRoomMessageSubscription";
import { useMessagesStore } from "@/services/messages/useMessagesStore";
import { useMessagesFetcher } from "@/services/messages/useMessagesFetcher";
import { useLocalMessageHandler } from "@/services/messages/useLocalMessageHandler";
import { v4 as uuidv4 } from 'uuid';

export function useRoomMessages(roomId: string | undefined) {
  const { messages, setMessages, addMessage, updateMessage, removeMessage } = useMessagesStore();
  const { fetchMessages } = useMessagesFetcher(roomId);
  const { createLocalMessage } = useLocalMessageHandler();
  const { sendMessage: persistMessage, isProcessing } = useMessagePersistence(roomId);
  
  const handleNewMessage = useCallback((message: RoomMessage) => {
    console.log("Handling new/updated message:", message);
    updateMessage(message);
  }, [updateMessage]);

  useRoomMessageSubscription(roomId, handleNewMessage);

  const addLocalMessage = useCallback((message: Partial<RoomMessage> & Pick<RoomMessage, 'id' | 'room_id' | 'message_text' | 'created_at'>) => {
    const completeMessage = createLocalMessage(message);
    addMessage(completeMessage);
  }, [addMessage, createLocalMessage]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!roomId) return;
      try {
        const dbMessages = await fetchMessages();
        setMessages(currentMessages => {
          const pendingMessages = currentMessages.filter(msg => msg.isPending);
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
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [roomId, fetchMessages, setMessages]);

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
        updateMessage({
          ...optimisticMessage,
          transaction_id: transactionId
        });
      }
      return transactionId;
    } catch (error) {
      removeMessage(optimisticId);
      throw error;
    }
  }, [roomId, persistMessage, addLocalMessage, updateMessage, removeMessage]);

  return {
    messages,
    isLoading: isProcessing,
    sendMessage,
    addLocalMessage,
    refetchMessages: fetchMessages,
  };
}
