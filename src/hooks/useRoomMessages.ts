import { useEffect, useCallback, useState } from "react";
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
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  const handleNewMessage = useCallback((message: RoomMessage) => {
    console.log("Handling new/updated message:", message);
    
    // If this is an update to an existing message, use updateMessage
    // If it's a completely new message, we should still handle it
    if (message.isPending === false) {
      updateMessage(message);
    } else {
      addMessage(message);
    }
  }, [updateMessage, addMessage]);

  // Subscribe to real-time updates
  useRoomMessageSubscription(roomId, handleNewMessage);

  const addLocalMessage = useCallback((message: Partial<RoomMessage> & Pick<RoomMessage, 'id' | 'room_id' | 'message_text' | 'created_at'>) => {
    console.log("Adding local message:", message);
    const completeMessage = createLocalMessage(message);
    addMessage(completeMessage);
  }, [addMessage, createLocalMessage]);

  // Initial load of messages from the database
  useEffect(() => {
    const loadMessages = async () => {
      if (!roomId) return;
      try {
        console.log("Fetching initial messages for room:", roomId);
        const dbMessages = await fetchMessages();
        
        console.log("Received database messages:", dbMessages.length);
        setMessages(currentMessages => {
          // Keep any pending messages that aren't in the database yet
          const pendingMessages = currentMessages.filter(msg => msg.isPending);
          console.log("Keeping pending messages:", pendingMessages.length);
          
          const combinedMessages = [...dbMessages];
          
          // Only keep pending messages that don't exist in DB
          pendingMessages.forEach(pendingMsg => {
            if (!pendingMsg.transaction_id) return;
            
            const existsInData = dbMessages.some(dbMsg => 
              (dbMsg.transaction_id && dbMsg.transaction_id === pendingMsg.transaction_id) ||
              dbMsg.id === pendingMsg.id
            );
            
            if (!existsInData) {
              console.log("Adding pending message to combined set:", pendingMsg);
              combinedMessages.push(pendingMsg);
            }
          });
          
          return combinedMessages.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
        
        setInitialLoadDone(true);
      } catch (error) {
        console.error("Error loading messages:", error);
        setInitialLoadDone(true);
      }
    };

    if (roomId) {
      console.log("Triggering initial message load for room:", roomId);
      loadMessages();
    }
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
    isLoading: isProcessing || !initialLoadDone,
    sendMessage,
    addLocalMessage,
    refetchMessages: fetchMessages,
  };
}
