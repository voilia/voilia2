
import { useState, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { submitSmartBarMessage } from "@/services/webhook/webhookService";
import { RoomMessage } from "@/types/room-messages";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

export function useMessageSender(
  roomId: string | undefined,
  projectId: string | null,
  addLocalMessage: (message: RoomMessage) => void,
  handleWebhookResponse: (response: any, transactionId: string) => void
) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = useCallback(async (text: string, files?: File[]) => {
    if (!roomId || !text.trim()) return;
    
    setIsProcessing(true);
    const transactionId = uuidv4();
    console.log("Creating new message with transaction ID:", transactionId);
    
    // Create and display optimistic user message immediately
    const optimisticUserMessage: RoomMessage = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      room_id: roomId,
      user_id: user?.id || null,
      agent_id: null,
      message_text: text,
      created_at: new Date().toISOString(),
      updated_at: null,
      messageType: 'user',
      transaction_id: transactionId,
      isPending: true
    };
    
    // Add user message immediately
    console.log("Adding optimistic user message:", optimisticUserMessage);
    addLocalMessage(optimisticUserMessage);
    
    try {
      let finalText = text;
      if (files && files.length > 0) {
        const fileNames = files.map(f => f.name).join(", ");
        finalText = `${text}\n\nAttached files: ${fileNames}`;
      }
      
      console.log("Submitting message to webhook:", finalText);
      
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
        onResponseReceived: handleWebhookResponse,
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
      setIsProcessing(false);
    }
  }, [roomId, projectId, user, addLocalMessage, handleWebhookResponse]);

  return {
    handleSendMessage,
    isProcessing
  };
}
