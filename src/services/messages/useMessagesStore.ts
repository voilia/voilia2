
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
      // Check if we already have this message by ID or transaction_id
      const existingMessage = prev.find(msg => 
        msg.id === message.id || msg.transaction_id === message.transaction_id
      );
      
      if (existingMessage) {
        // Update existing message
        return prev.map(msg => 
          (msg.id === message.id || msg.transaction_id === message.transaction_id) 
            ? { ...message, isPending: false } 
            : msg
        );
      } else {
        // This is a new message from the database - add it
        console.log("Adding new message from real-time subscription:", message);
        return [...prev, message].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
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
