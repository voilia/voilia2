import { useState, useEffect, useCallback, useRef } from "react";
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
  const channelRef = useRef<any>(null);
  const initialFetchDoneRef = useRef<boolean>(false);
  const pendingMessageIdsRef = useRef<Set<string>>(new Set());
  
  const fetchMessages = useCallback(async () => {
    if (!roomId || !user) return;

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
        console.log("Pending messages before merging:", pendingMessages.length, pendingMessages);
        
        const dbMessages = [...(data || [])].map(msg => ({
          ...msg,
          transaction_id: msg.transaction_id || `db-${msg.id}`,
          messageType: msg.user_id === null ? 'agent' : 'user'
        }));
        
        const combinedMessages = [...dbMessages];
        pendingMessages.forEach(pendingMsg => {
          if (!pendingMsg.transaction_id) return;
          
          const existsInData = dbMessages.some(dbMsg => 
            dbMsg.transaction_id === pendingMsg.transaction_id
          );
          
          if (!existsInData) {
            console.log("Keeping pending message not found in DB:", pendingMsg);
            combinedMessages.push(pendingMsg);
          } else {
            console.log("Message exists in DB, not adding pending version:", pendingMsg.transaction_id);
            pendingMessageIdsRef.current.add(pendingMsg.id);
          }
        });
        
        return combinedMessages.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
      
      initialFetchDoneRef.current = true;
    } catch (err) {
      console.error("Error fetching room messages:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [roomId, user]);

  useEffect(() => {
    if (!roomId || !user) return;

    if (channelRef.current) {
      console.log("Removing existing channel for room:", roomId);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    fetchMessages();

    console.log("Setting up realtime subscription for room:", roomId);
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
            transaction_id: (payload.new as any).transaction_id || `rt-${(payload.new as any).id}`,
            messageType: (payload.new as any).user_id ? 'user' : 'agent'
          };
          
          setMessages((prev) => {
            if (!newMessage.transaction_id) {
              console.log("Message has no transaction ID, adding as new:", newMessage);
              return [...prev, newMessage];
            }
            
            const pendingIndex = prev.findIndex(msg => 
              msg.transaction_id === newMessage.transaction_id
            );
            
            if (pendingIndex >= 0) {
              console.log("Found matching pending message at index:", pendingIndex);
              
              const updatedMessages = [...prev];
              const existingMsg = updatedMessages[pendingIndex];
              
              updatedMessages[pendingIndex] = {
                ...existingMsg,
                ...newMessage,
                isPending: false,
                messageType: existingMsg.messageType || newMessage.messageType
              };
              
              pendingMessageIdsRef.current.add(existingMsg.id);
              
              console.log("Updated message:", updatedMessages[pendingIndex]);
              return updatedMessages;
            }
            
            const exists = prev.some(msg => 
              (newMessage.id && msg.id === newMessage.id) || 
              msg.transaction_id === newMessage.transaction_id
            );
            
            if (exists) {
              console.log("Received duplicate message, not adding:", newMessage);
              return prev;
            }
            
            console.log("No matching pending message, adding as new:", newMessage);
            const newMessages = [...prev, newMessage];
            
            return newMessages.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
        }
      )
      .subscribe((status) => {
        console.log(`Room ${roomId} realtime subscription status:`, status);
        if (status === "SUBSCRIBED") {
          console.log(`Successfully subscribed to room ${roomId} messages`);
        }
      });
    
    channelRef.current = channel;

    return () => {
      console.log("Cleaning up: Removing channel for room:", roomId);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, user?.id, user, fetchMessages]);

  const addLocalMessage = useCallback((message: RoomMessage) => {
    console.log("Adding local message:", message);
    const messageWithTransaction = {
      ...message,
      transaction_id: message.transaction_id || `local-${message.id}`
    };
    
    setMessages(prev => {
      const exists = prev.some(m => 
        (m.id === messageWithTransaction.id && m.id !== undefined) || 
        m.transaction_id === messageWithTransaction.transaction_id
      );
      
      if (exists) {
        console.log("Message already exists, not adding duplicate");
        return prev;
      }
      
      if (pendingMessageIdsRef.current.has(messageWithTransaction.id)) {
        console.log("Message already persisted, not adding duplicate with ID:", messageWithTransaction.id);
        return prev;
      }
      
      const newMessages = [...prev, messageWithTransaction];
      
      return newMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, []);

  const sendMessage = useCallback(async (text: string, transactionId?: string) => {
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
      let retries = 0;
      const maxRetries = 3;
      let success = false;
      let lastError = null;
      
      while (retries < maxRetries && !success) {
        try {
          const { error } = await supabase
            .from("room_messages")
            .insert({
              room_id: roomId,
              message_text: text,
              transaction_id: msgTransactionId
            });

          if (error) {
            lastError = error;
            retries++;
            console.log(`Retry ${retries}/${maxRetries} for message send:`, error.message);
            await new Promise(resolve => setTimeout(resolve, retries * 500));
          } else {
            success = true;
          }
        } catch (err) {
          lastError = err;
          retries++;
          console.log(`Retry ${retries}/${maxRetries} for message send due to exception:`, err);
          await new Promise(resolve => setTimeout(resolve, retries * 500));
        }
      }
      
      if (!success) {
        throw lastError;
      }
      
      return msgTransactionId;
    } catch (err) {
      console.error("Error sending message after retries:", err);
      
      const isNetworkError = err instanceof Error && 
        (err.message.includes('network') || 
         err.message.includes('timeout') || 
         err.message.includes('connection'));
      
      if (!isNetworkError) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id 
              ? { ...msg, isPending: false, error: true } 
              : msg
          )
        );
      }
      
      toast.error("Failed to send message");
      throw err;
    }
  }, [roomId, user, authLoading, addLocalMessage]);

  const refetchMessages = useCallback(() => {
    if (initialFetchDoneRef.current) {
      console.log("Force refreshing messages for room:", roomId);
      fetchMessages();
    }
  }, [fetchMessages, roomId]);

  return {
    messages,
    isLoading: isLoading || authLoading,
    error,
    sendMessage,
    addLocalMessage,
    refetchMessages,
  };
}
