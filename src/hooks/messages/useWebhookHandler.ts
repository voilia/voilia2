
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
    
    try {
      // Extract the message text from various possible response structures
      let messageText = null;
      let messageId = null;
      let agentId = null;
      
      // Handle response from n8n webhook with the expected structure from the spec
      if (response.success === true && response.response) {
        console.log("Processing structured n8n response:", response.response);
        messageText = response.response.text;
        messageId = response.response.messageId;
        
        // Check if response has agent information in data
        if (response.data && response.data.agent && response.data.agent.id) {
          agentId = response.data.agent.id;
        }
      } 
      // Handle response.data.response structure 
      else if (response.data?.response) {
        console.log("Processing data.response structure:", response.data.response);
        messageText = response.data.response.text || response.data.response.message;
        messageId = response.data.response.messageId;
        
        // Check for agent info in data
        if (response.data.agent && response.data.agent.id) {
          agentId = response.data.agent.id;
        }
      }
      // Handle other response structures or fallback message
      else {
        console.log("Using fallback message extraction");
        messageText = response.message || 
                    response.data?.message || 
                    response.data?.text ||
                    response.response?.text ||
                    "I've received your message and am processing it. Please wait while I formulate a response.";
      }
      
      // Try to extract agent ID if available and validate it's a UUID
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
      
      // Create unique ID for the message
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
        isPending: true
      };
      
      // Add AI response immediately to local state
      console.log("Adding AI response to chat:", aiMessage);
      addLocalMessage(aiMessage);
      
    } catch (error) {
      console.error("Error processing webhook response:", error);
      toast.error("Failed to process AI response");
    }
  }, [roomId, addLocalMessage]);

  return handleWebhookResponse;
}
