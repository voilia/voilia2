
import { useCallback } from "react";
import { submitSmartBarMessage } from "@/services/webhook/webhookService";
import { addAiResponseToRoom } from "@/services/messages/roomMessages";
import { RoomMessage } from "@/types/room-messages";
import { toast } from "sonner";

export function useWebhookHandler(
  roomId: string | undefined,
  projectId: string | null,
  addLocalMessage: (message: RoomMessage) => void
) {
  const handleWebhookResponse = useCallback(async (response: any, transactionId: string) => {
    if (!roomId) return;
    
    console.log("Received webhook response:", response);
    
    try {
      if (response.message) {
        const agentId = response.agent_id && 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(response.agent_id) 
            ? response.agent_id 
            : null;
        
        // Create unique ID for the optimistic message
        const messageId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Create optimistic AI message for immediate display
        const optimisticAiMessage: RoomMessage = {
          id: messageId,
          room_id: roomId,
          user_id: null,
          agent_id: agentId,
          message_text: response.message,
          created_at: new Date().toISOString(),
          updated_at: null,
          messageType: 'agent',
          transaction_id: transactionId,
          isPending: true
        };
        
        // Add AI response immediately with pending state
        console.log("Adding optimistic AI response:", optimisticAiMessage);
        addLocalMessage(optimisticAiMessage);
        
        // Save the response to the database
        await addAiResponseToRoom(
          roomId, 
          agentId, 
          response.message,
          transactionId
        );
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
