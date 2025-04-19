
import { useCallback } from "react";
import { RoomMessage } from "@/types/room-messages";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export function useWebhookHandler(
  roomId: string | undefined,
  projectId: string | null,
  addLocalMessage: (message: RoomMessage) => void
) {
  const handleWebhookResponse = useCallback(async (response: any, transactionId: string) => {
    if (!roomId) return;
    
    console.log("Received webhook response:", response);
    
    // Skip internal messages explicitly marked for no display
    if (response.internal === true && !response.message) {
      console.log("Skipping internal placeholder message with no content");
      return;
    }
    
    try {
      // Extract the message text from various possible response structures
      let messageText = null;
      let messageId = null;
      let agentId = null;
      let isPending = false;
      
      // For standard response format from n8n webhook
      if (response.success === true && response.response && response.response.text) {
        console.log("Processing standard response format:", response.response);
        messageText = response.response.text;
        messageId = response.response.messageId;
        
        // Look for agent info
        if (response.data && response.data.agent && response.data.agent.id) {
          agentId = response.data.agent.id;
        }
      } 
      // For no-cors initial response (a placeholder)
      else if (response.status === "processing" && response.message) {
        console.log("Processing initial no-cors response:", response.message);
        messageText = response.message;
        isPending = true;
      }
      // For awaiting response follow-up
      else if (response.status === "awaiting" && response.message) {
        console.log("Processing awaiting follow-up:", response.message);
        messageText = response.message;
        isPending = true;
      }
      // Alternative response format with nested data
      else if (response.data?.response) {
        console.log("Processing alternative response format:", response.data.response);
        messageText = response.data.response.text || response.data.response.message;
        messageId = response.data.response.messageId;
        
        if (response.data.agent && response.data.agent.id) {
          agentId = response.data.agent.id;
        }
      }
      // Fallback for other formats
      else {
        console.log("Using fallback response extraction");
        messageText = response.message || 
                    response.data?.message || 
                    response.data?.text ||
                    response.response?.text ||
                    (typeof response === 'string' ? response : null);
                    
        // Skip empty messages
        if (!messageText) {
          console.log("Skipping empty message");
          return;
        }
        
        // Check if this is a placeholder message
        if (messageText.includes("processing") || messageText.includes("awaiting response")) {
          isPending = true;
        }
      }
      
      // Try to extract agent ID if available
      if (agentId === null && response.data?.agent?.id) {
        const idCandidate = response.data.agent.id;
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idCandidate)) {
          agentId = idCandidate;
        }
      }
      
      // Skip if no message text was extracted
      if (!messageText) {
        console.warn("No message text found in response:", response);
        return;
      }
      
      // Use isPending from the response if it exists, otherwise use our determination
      isPending = response.isPending !== undefined ? response.isPending : isPending;
      
      // Create unique ID for the message if none provided
      const localMessageId = messageId || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Create AI message for immediate display
      const aiMessage: RoomMessage = {
        id: localMessageId,
        room_id: roomId,
        user_id: null,
        agent_id: agentId,
        message_text: messageText,
        created_at: new Date().toISOString(),
        updated_at: null,
        messageType: 'agent' as const,
        transaction_id: transactionId || uuidv4(),
        isPending: isPending
      };
      
      // Add AI response immediately to local state with a small delay
      // to ensure React state updates happen in sequence
      console.log("Adding AI response to chat:", aiMessage);
      
      setTimeout(() => {
        addLocalMessage(aiMessage);
      }, 10);
      
    } catch (error) {
      console.error("Error processing webhook response:", error);
      toast.error("Failed to process AI response");
    }
  }, [roomId, addLocalMessage]);

  return handleWebhookResponse;
}
