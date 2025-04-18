
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
      // Check if we have a simulated response from no-cors mode
      if (response.status === "processing" || response.status === "sent" || 
          (response.message && response.message.includes("CORS restrictions"))) {
        console.log("Processing response with status:", response.status);
        
        // Try to extract any message content if available
        const messageText = response.message || 
                          response.data?.message || 
                          "I've received your message and am processing it. Please wait while I formulate a response.";
        
        // Create unique ID for the optimistic message
        const messageId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Create optimistic AI message for immediate display
        const optimisticAiMessage: RoomMessage = {
          id: messageId,
          room_id: roomId,
          user_id: null,
          agent_id: null,
          message_text: messageText,
          created_at: new Date().toISOString(),
          updated_at: null,
          messageType: 'agent' as const,
          transaction_id: transactionId || uuidv4(),
          isPending: true
        };
        
        // Add AI response immediately to local state
        console.log("Adding optimistic AI response for CORS-limited message:", optimisticAiMessage);
        addLocalMessage(optimisticAiMessage);
        return;
      }
      
      // Extract the message from the response structure for normal responses
      const messageData = response.data?.response || response.data;
      const messageText = messageData?.text || messageData?.message || response.message;

      if (messageText) {
        // Extract agent ID if available
        const agentId = response.data?.agent?.id && 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(response.data.agent.id) 
            ? response.data.agent.id 
            : null;
        
        // Create unique ID for the optimistic message
        const messageId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Create optimistic AI message for immediate display
        const optimisticAiMessage: RoomMessage = {
          id: messageId,
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
        console.log("Adding optimistic AI response:", optimisticAiMessage);
        addLocalMessage(optimisticAiMessage);
      } else if (response.error) {
        console.error("Error in webhook response:", response.error);
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error processing webhook response:", error);
      toast.error("Failed to process AI response");
    }
  }, [roomId, addLocalMessage]);

  return handleWebhookResponse;
}
