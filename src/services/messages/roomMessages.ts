
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
    
    // Get the current Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no active session, return an optimistic message object
    if (!session) {
      console.warn("No active session for AI response insertion, returning optimistic message");
      
      // Create a consistent transaction ID if none was provided
      const msgTransactionId = transactionId || `temp-${Date.now()}`;
      
      return {
        id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        room_id: roomId,
        user_id: null,
        agent_id: agentId,
        message_text: message,
        created_at: new Date().toISOString(),
        updated_at: null,
        messageType: 'agent',
        transaction_id: msgTransactionId,
        isPending: true // Mark as pending since it's not in the database
      };
    }
    
    // Validate agent ID if present (ensure it's a valid UUID)
    const validAgentId = agentId && isValidUUID(agentId) ? agentId : null;
    
    // Use provided transaction ID or create a consistent one
    const msgTransactionId = transactionId || `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    console.log("Inserting AI message with transaction ID:", msgTransactionId);
    
    // Insert the message into the database
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
    
    // Return the database record with added messageType
    return {
      ...data,
      messageType: 'agent',
      transaction_id: data.transaction_id || msgTransactionId,
      isPending: false
    };
  } catch (error) {
    console.error("Error adding AI response:", error);
    
    // Determine if this is a network error
    const isNetworkError = error instanceof Error && 
      (error.message.includes('network') || 
       error.message.includes('timeout') || 
       error.message.includes('connection'));
    
    if (isNetworkError) {
      console.warn("Network error detected, returning optimistic message to maintain UI");
    }
    
    // Return an optimistic message object for the UI even if the DB insert failed
    // This prevents UI disruption during network issues
    const msgTransactionId = transactionId || `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    return {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      room_id: roomId,
      user_id: null,
      agent_id: agentId,
      message_text: message,
      created_at: new Date().toISOString(),
      updated_at: null,
      messageType: 'agent',
      transaction_id: msgTransactionId,
      isPending: true // Mark as pending since it's not confirmed in the database
    };
  }
}
