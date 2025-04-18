
import { supabase } from "@/integrations/supabase/client";
import { RoomMessage } from "@/hooks/useRoomMessages";
import { toast } from "sonner";
import { isValidUUID } from "../webhook/utils";

export async function addAiResponseToRoom(
  roomId: string, 
  agentId: string | null, 
  message: string,
  transactionId?: string
): Promise<RoomMessage | null> {
  try {
    console.log("Adding AI response to room:", { roomId, agentId, transactionId });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No active session for AI response insertion");
      return {
        id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        room_id: roomId,
        user_id: null,
        agent_id: agentId,
        message_text: message,
        created_at: new Date().toISOString(),
        updated_at: null,
        messageType: 'agent',
        transaction_id: transactionId || `temp-${Date.now()}`
      };
    }
    
    const validAgentId = agentId && isValidUUID(agentId) ? agentId : null;
    const msgTransactionId = transactionId || `temp-${Date.now()}`;
    
    const { data, error } = await supabase
      .from("room_messages")
      .insert({
        room_id: roomId,
        agent_id: validAgentId,
        message_text: message,
        user_id: null,
        transaction_id: msgTransactionId
      })
      .select('*')
      .single();
    
    if (error) {
      console.error("Supabase error adding AI response:", error);
      throw error;
    }
    
    console.log("Successfully added AI response to database:", data);
    return {
      ...data,
      messageType: 'agent',
      transaction_id: data.transaction_id || msgTransactionId
    };
  } catch (error) {
    console.error("Error adding AI response:", error);
    
    // Return an optimistic message object for the UI even if the DB insert failed
    return {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      room_id: roomId,
      user_id: null,
      agent_id: agentId,
      message_text: message,
      created_at: new Date().toISOString(),
      updated_at: null,
      messageType: 'agent',
      transaction_id: transactionId || `temp-${Date.now()}`
    };
  }
}
