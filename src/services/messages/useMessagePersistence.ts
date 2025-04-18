
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomMessage } from "@/types/room-messages";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

export const useMessagePersistence = (roomId: string | undefined) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = useCallback(async (text: string, userId: string | null): Promise<string | undefined> => {
    if (!roomId || !text.trim()) return;

    const msgTransactionId = uuidv4();
    setIsProcessing(true);

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
            await new Promise(resolve => setTimeout(resolve, retries * 500));
          } else {
            success = true;
          }
        } catch (err) {
          lastError = err;
          retries++;
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
        toast.error("Failed to send message");
      }
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [roomId]);

  return {
    sendMessage,
    isProcessing
  };
};
