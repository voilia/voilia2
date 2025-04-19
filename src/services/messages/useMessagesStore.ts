
import { useState, useCallback, useEffect, useRef } from "react";
import { RoomMessage } from "@/types/room-messages";

export function useMessagesStore() {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [lastAddedMessage, setLastAddedMessage] = useState<string | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Debug current messages in state
  useEffect(() => {
    console.log("Current messages in store:", messages.length);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [messages]);

  const addMessage = useCallback((message: RoomMessage) => {
    // Skip placeholder messages entirely
    if (message.message_text && (
        message.message_text.includes("processing your request") ||
        message.message_text.includes("is being processed") ||
        message.message_text.includes("awaiting response")
    )) {
      console.log("Skipping placeholder message:", message.message_text);
      return;
    }
  
    // Prevent duplicate additions within 100ms
    if (lastAddedMessage === message.id) {
      console.log("Duplicate message addition attempt prevented:", message.id);
      return;
    }
    
    setLastAddedMessage(message.id);
    // Clear the lastAddedMessage after a short time
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLastAddedMessage(null), 100);
    
    setMessages(prev => {
      // Check for exact ID match
      const exactIdMatch = prev.some(msg => msg.id === message.id);
      
      if (exactIdMatch) {
        console.log("Exact ID match found, not adding duplicate:", message.id);
        return prev;
      }
      
      // Check for transaction ID match to avoid duplicates
      if (message.transaction_id) {
        const transactionMatch = prev.some(msg => 
          msg.transaction_id === message.transaction_id && 
          msg.messageType === message.messageType
        );
        
        if (transactionMatch) {
          console.log("Transaction ID match found, updating existing:", message.transaction_id);
          return prev.map(msg => 
            msg.transaction_id === message.transaction_id && msg.messageType === message.messageType
              ? { ...message, isPending: false } 
              : msg
          );
        }
      }
      
      console.log("Adding new message to store:", message);
      
      // Add the message and ensure it's properly sorted by timestamp
      return [...prev, message].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, [lastAddedMessage]);

  const updateMessage = useCallback((message: RoomMessage) => {
    // Skip placeholder messages entirely
    if (message.message_text && (
        message.message_text.includes("processing your request") ||
        message.message_text.includes("is being processed") ||
        message.message_text.includes("awaiting response")
    )) {
      console.log("Skipping placeholder message update:", message.message_text);
      return;
    }
    
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
      
      // If it's a completely new message from the real-time subscription, add it
      console.log("No matching message found, adding as new from real-time:", message);
      return [...prev, { ...message, isPending: false }].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  const clearPlaceholderMessages = useCallback(() => {
    setMessages(prev => prev.filter(msg => 
      !msg.message_text.includes("processing your request") &&
      !msg.message_text.includes("is being processed") &&
      !msg.message_text.includes("awaiting response")
    ));
  }, []);

  return {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage,
    clearPlaceholderMessages
  };
}
