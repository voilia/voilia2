
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
          console.log("Transaction ID match found, not adding duplicate:", message.transaction_id);
          return prev.map(msg => 
            msg.transaction_id === message.transaction_id 
              ? { ...message, isPending: false } 
              : msg
          );
        }
      }
      
      // Avoid adding "waiting for response" placeholders if we already have responses
      if (message.message_text && 
          (message.message_text.includes("waiting for") || 
           message.message_text.includes("processing") || 
           message.message_text.includes("being processed"))) {
        
        // Count recent agent messages in the last 5 seconds
        const recentAgentMessages = prev.filter(msg => 
          msg.messageType === 'agent' && 
          new Date().getTime() - new Date(msg.created_at).getTime() < 5000
        );
        
        if (recentAgentMessages.length > 0) {
          console.log("Skipping placeholder message since we already have recent agent messages");
          return prev;
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
      
      // If the incoming message is a placeholder and we already have other agent messages,
      // don't add it as new
      if (message.message_text && 
         (message.message_text.includes("waiting for") || 
          message.message_text.includes("processing") || 
          message.message_text.includes("being processed"))) {
        
        const existingAgentMessages = prev.filter(msg => 
          msg.messageType === 'agent' && 
          !msg.message_text.includes("waiting for") &&
          !msg.message_text.includes("processing") &&
          !msg.message_text.includes("being processed")
        );
        
        if (existingAgentMessages.length > 0) {
          console.log("Not adding placeholder message as we already have agent messages");
          return prev;
        }
      }
      
      // If we get here, this is a completely new message from the real-time subscription
      // We should add it to the list rather than ignoring it
      console.log("No matching message found, adding as new from real-time:", message);
      return [...prev, { ...message, isPending: false }].sort((a, b) => 
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
