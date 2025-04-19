
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
      // Only check for exact ID match, not transaction_id
      // This allows messages with the same transaction_id but different IDs to be added
      const exactIdMatch = prev.some(msg => msg.id === message.id);
      
      if (exactIdMatch) {
        console.log("Exact ID match found, not adding duplicate:", message.id);
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
      // First check if we have this exact message by ID
      const exactMatch = prev.find(msg => msg.id === message.id);
      
      // Next check for transaction_id match
      const transactionMatch = prev.find(msg => 
        msg.transaction_id && 
        message.transaction_id && 
        msg.transaction_id === message.transaction_id
      );
      
      // If we have any match, update it
      if (exactMatch || transactionMatch) {
        console.log("Found existing message to update");
        return prev.map(msg => 
          (msg.id === message.id || 
            (msg.transaction_id && message.transaction_id && msg.transaction_id === message.transaction_id)) 
            ? { ...message, isPending: false } 
            : msg
        );
      }
      
      // If we get here, this is a completely new message from the real-time subscription
      // We should add it to the list rather than ignoring it
      console.log("No matching message found, adding as new from real-time:", message);
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
