
import { useState, useCallback } from "react";
import { RoomMessage } from "@/types/room-messages";

export function useMessagesStore() {
  const [messages, setMessages] = useState<RoomMessage[]>([]);

  const addMessage = useCallback((message: RoomMessage) => {
    setMessages(prev => {
      const exists = prev.some(msg => 
        msg.id === message.id || 
        msg.transaction_id === message.transaction_id
      );
      
      if (exists) {
        console.log("Message already exists, not adding duplicate:", message.id);
        return prev;
      }
      
      return [...prev, message].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, []);

  const updateMessage = useCallback((message: RoomMessage) => {
    setMessages(prev => {
      const pendingIndex = prev.findIndex(msg => 
        msg.transaction_id === message.transaction_id
      );
      
      if (pendingIndex >= 0) {
        const updatedMessages = [...prev];
        updatedMessages[pendingIndex] = message;
        return updatedMessages;
      }
      
      return prev;
    });
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  return {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage
  };
}
