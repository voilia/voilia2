
import { useCallback } from "react";
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
      // Extract the message from the response structure
      const messageText = response.data?.response?.text;
      if (messageText) {
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
          transaction_id: transactionId,
          isPending: true
        };
        
        // Add AI response immediately to local state
        console.log("Adding optimistic AI response:", optimisticAiMessage);
        addLocalMessage(optimisticAiMessage);
        
        try {
          // Save the response to the database asynchronously
          await addAiResponseToRoom(
            roomId, 
            agentId, 
            messageText,
            transactionId
          );
        } catch (dbError) {
          console.error("Error saving AI response to database:", dbError);
          toast.error("Failed to save AI response");
        }
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
