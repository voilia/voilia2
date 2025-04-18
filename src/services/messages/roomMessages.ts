
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
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No active session for AI response insertion");
      return {
        id: `temp-${Date.now()}`,
        room_id: roomId,
        user_id: null,
        agent_id: agentId,
        message_text: message,
        created_at: new Date().toISOString(),
        updated_at: null,
        messageType: 'agent',
        transaction_id: transactionId
      };
    }
    
    const validAgentId = agentId && isValidUUID(agentId) ? agentId : null;
    
    const { data, error } = await supabase
      .from("room_messages")
      .insert({
        room_id: roomId,
        agent_id: validAgentId,
        message_text: message,
        user_id: null,
        transaction_id: transactionId
      })
      .select('*')
      .single();
    
    if (error) {
      console.error("Supabase error adding AI response:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error adding AI response:", error);
    
    return {
      id: `temp-${Date.now()}`,
      room_id: roomId,
      user_id: null,
      agent_id: null,
      message_text: message,
      created_at: new Date().toISOString(),
      updated_at: null,
      messageType: 'agent',
      transaction_id: transactionId
    };
  }
}
