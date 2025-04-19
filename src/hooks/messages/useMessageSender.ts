
import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { submitSmartBarMessage } from "@/services/webhook/webhookService";
import { RoomMessage } from "@/types/room-messages";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Element to show when AI is "thinking"
const ThinkingIndicator = () => (
  <div className="thinking-indicator">
    <span className="dot"></span>
    <span className="dot"></span>
    <span className="dot"></span>
  </div>
);

export function useMessageSender(
  roomId: string | undefined,
  projectId: string | null,
  addLocalMessage: (message: RoomMessage) => void,
  handleWebhookResponse: (response: any, transactionId: string) => void
) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendMessage = useCallback(async (text: string, files?: File[]) => {
    if (!roomId || !text.trim()) return;
    
    setIsProcessing(true);
    const transactionId = uuidv4();
    console.log("Creating new message with transaction ID:", transactionId);
    
    // Create and display optimistic user message immediately
    const optimisticUserMessage: RoomMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      room_id: roomId,
      user_id: user?.id || null,
      agent_id: null,
      message_text: text,
      created_at: new Date().toISOString(),
      updated_at: null,
      messageType: 'user',
      transaction_id: transactionId,
      isPending: false // Set to false to ensure it appears immediately
    };
    
    // Add user message immediately to UI
    console.log("Adding optimistic user message:", optimisticUserMessage);
    addLocalMessage(optimisticUserMessage);
    
    try {
      // Persist the user message to the database
      const { error: dbError } = await supabase
        .from("room_messages")
        .insert({
          room_id: roomId,
          user_id: user?.id,
          message_text: text,
          transaction_id: transactionId
        });
      
      if (dbError) {
        console.error("Error persisting user message to database:", dbError);
        throw dbError;
      }
      
      let finalText = text;
      if (files && files.length > 0) {
        const fileNames = files.map(f => f.name).join(", ");
        finalText = `${text}\n\nAttached files: ${fileNames}`;
      }
      
      console.log("Submitting message to webhook:", finalText);
      
      // Send the message to the webhook
      const result = await submitSmartBarMessage({
        message: finalText,
        roomId,
        projectId,
        mode: 'chat',
        uploadedFiles: files?.map(file => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          preview: URL.createObjectURL(file)
        })) || [],
        onResponseReceived: (response, tid) => {
          // Process webhook response
          handleWebhookResponse(response, tid);
        },
        transactionId
      });
      
      if (!result.success && result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      // Clear any pending timers
      if (thinkingTimerRef.current) {
        clearTimeout(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
      
      setIsProcessing(false);
    }
  }, [roomId, projectId, user, addLocalMessage, handleWebhookResponse]);

  return {
    handleSendMessage,
    isProcessing
  };
}
