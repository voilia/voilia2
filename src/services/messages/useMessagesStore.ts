
import { useState, useCallback, useEffect } from "react";
import { RoomMessage } from "@/types/room-messages";

export function useMessagesStore() {
  const [messages, setMessages] = useState<RoomMessage[]>([]);

  // Debug current messages in state
  useEffect(() => {
    console.log("Current messages in store:", messages.length);
  }, [messages]);

  const addMessage = useCallback((message: RoomMessage) => {
    setMessages(prev => {
      const exists = prev.some(msg => 
        msg.id === message.id || 
        (msg.transaction_id && message.transaction_id && 
          msg.transaction_id === message.transaction_id)
      );
      
      if (exists) {
        console.log("Message already exists, not adding duplicate:", message.id);
        return prev;
      }
      
      console.log("Adding new message to store:", message);
      return [...prev, message].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, []);

  const updateMessage = useCallback((message: RoomMessage) => {
    console.log("Trying to update message:", message);
    
    setMessages(prev => {
      // Debug existing messages
      console.log("Current message count:", prev.length);
      
      // First check if we have this exact message by ID
      const exactMatch = prev.find(msg => msg.id === message.id);
      if (exactMatch) {
        console.log("Found exact match by ID, updating");
        return prev.map(msg => 
          msg.id === message.id ? { ...message, isPending: false } : msg
        );
      }
      
      // Next check for transaction_id match
      const transactionMatch = prev.find(msg => 
        msg.transaction_id && 
        message.transaction_id && 
        msg.transaction_id === message.transaction_id
      );
      
      if (transactionMatch) {
        console.log("Found match by transaction_id, updating");
        return prev.map(msg => 
          (msg.transaction_id === message.transaction_id) 
            ? { ...message, isPending: false } 
            : msg
        );
      }
      
      // If we get here, this is a completely new message
      console.log("No matching message found, adding as new:", message);
      return [...prev, message].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
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
