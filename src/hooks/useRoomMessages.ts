
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { v4 as uuidv4 } from 'uuid';

export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string | null;
  agent_id: string | null;
  message_text: string | null;
  created_at: string;
  updated_at: string | null;
  isPending?: boolean;
  transaction_id: string; // Changed from optional to required
  messageType?: 'user' | 'agent';
}

export function useRoomMessages(roomId: string | undefined) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!roomId || !user) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("room_messages")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        setMessages(currentMessages => {
          // Keep track of all pending messages
          const pendingMessages = currentMessages.filter(msg => msg.isPending);
          console.log("Pending messages before merging:", pendingMessages.length, pendingMessages);
          
          // Process database messages
          const combinedMessages = [...(data || [])].map(msg => ({
            ...msg,
            // Ensure transaction_id is never null
            transaction_id: msg.transaction_id || `db-${msg.id}` 
          }));
          
          // For each pending message, check if it exists in the database
          pendingMessages.forEach(pendingMsg => {
            if (!pendingMsg.transaction_id) return;
            
            // Check if this pending message already exists in database results
            const existsInData = combinedMessages.some(dbMsg => 
              dbMsg.transaction_id === pendingMsg.transaction_id
            );
            
            // If message is not in database yet, keep the pending version
            if (!existsInData) {
              console.log("Keeping pending message:", pendingMsg);
              combinedMessages.push(pendingMsg);
            } else {
              console.log("Message exists in DB, not adding pending version:", pendingMsg.transaction_id);
            }
          });
          
          // Sort by creation time to ensure correct order
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
    };

    fetchMessages();

    const channel = supabase
      .channel(`room_${roomId}_messages`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log("New message from realtime:", payload.new);
          const newMessage = {
            ...payload.new as RoomMessage,
            transaction_id: (payload.new as any).transaction_id || `rt-${(payload.new as any).id}`
          };
          
          setMessages((prev) => {
            // Handle messages without transaction IDs
            if (!newMessage.transaction_id) {
              console.log("Message has no transaction ID, adding as new:", newMessage);
              return [...prev, newMessage];
            }
            
            // Find any pending message with the same transaction ID
            const pendingIndex = prev.findIndex(msg => 
              msg.transaction_id === newMessage.transaction_id
            );
            
            // If we found a matching message, replace it while preserving local properties
            if (pendingIndex >= 0) {
              console.log("Found matching pending message at index:", pendingIndex);
              
              const updatedMessages = [...prev];
              const existingMsg = updatedMessages[pendingIndex];
              
              // Merge the new message with the existing one, ensuring we keep
              // any properties like messageType that might be set locally
              updatedMessages[pendingIndex] = {
                ...existingMsg,
                ...newMessage,
                // Set isPending to false since it's now saved
                isPending: false,
                // Preserve messageType if it exists
                messageType: existingMsg.messageType
              };
              
              console.log("Updated message:", updatedMessages[pendingIndex]);
              return updatedMessages;
            }
            
            // If no matching pending message found, add as new
            console.log("No matching pending message, adding as new");
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      console.log("Removing channel for room:", roomId);
      supabase.removeChannel(channel);
    };
  }, [roomId, user?.id, user]);

  const addLocalMessage = (message: RoomMessage) => {
    console.log("Adding local message:", message);
    const messageWithTransaction = {
      ...message,
      transaction_id: message.transaction_id || `local-${message.id}`
    };
    
    setMessages(prev => {
      // Check if the message already exists with the same transaction ID
      const exists = prev.some(m => 
        m.transaction_id === messageWithTransaction.transaction_id
      );
      
      if (exists) {
        console.log("Message already exists, not adding duplicate");
        return prev;
      }
      
      const newMessages = [...prev, messageWithTransaction];
      
      // Sort by creation time to ensure correct order
      return newMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  };

  const sendMessage = async (text: string, transactionId?: string) => {
    if (!roomId || !text.trim() || !user) {
      if (!user && !authLoading) {
        toast.error("Authentication required", {
          description: "Please log in to send messages"
        });
      }
      return;
    }

    const msgTransactionId = transactionId || uuidv4();
    console.log("Sending message with transaction ID:", msgTransactionId);

    const optimisticMessage: RoomMessage = {
      id: uuidv4(),
      room_id: roomId,
      user_id: user.id,
      agent_id: null,
      message_text: text,
      created_at: new Date().toISOString(),
      updated_at: null,
      isPending: true,
      transaction_id: msgTransactionId,
      messageType: 'user'
    };

    addLocalMessage(optimisticMessage);

    try {
      const { error } = await supabase
        .from("room_messages")
        .insert({
          room_id: roomId,
          message_text: text,
          transaction_id: msgTransactionId
        });

      if (error) throw error;
      
      return msgTransactionId;
    } catch (err) {
      console.error("Error sending message:", err);
      
      // Only remove the optimistic message if the error is not a network error
      // This prevents messages from disappearing when there are connection issues
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      
      toast.error("Failed to send message");
      throw err;
    }
  };

  return {
    messages,
    isLoading: isLoading || authLoading,
    error,
    sendMessage,
    addLocalMessage,
  };
}
