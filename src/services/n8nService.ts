
import { supabase } from "@/integrations/supabase/client";
import { SmartBarMode, UploadedFile } from "@/components/smart-bar/types/smart-bar-types";
import { toast } from "sonner";
import { RoomMessage } from "@/hooks/useRoomMessages";
import { v4 as uuidv4 } from 'uuid';

interface WebhookPayload {
  user_id: string;
  room_id: string;
  project_id: string | null;
  message: string;
  mode: SmartBarMode;
  language: string;
  files: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  voice_url?: string;
  thread_id?: string;
  agent_ids: string[];
  transaction_id: string; // Add transaction ID to payload
}

interface SubmitSmartBarMessageOptions {
  message: string;
  roomId: string;
  projectId: string | null;
  mode: SmartBarMode;
  uploadedFiles?: UploadedFile[];
  voiceUrl?: string;
  threadId?: string;
  agentIds?: string[];
  language?: string;
  transactionId?: string; // Add transaction ID option
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onResponseReceived?: (response: any, transactionId: string) => void; // Modified to include transaction ID
}

// Helper to validate UUID format
const isValidUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export async function submitSmartBarMessage({
  message,
  roomId,
  projectId,
  mode,
  uploadedFiles = [],
  voiceUrl,
  threadId,
  agentIds = [],
  language = 'en',
  transactionId,
  onStart,
  onComplete,
  onError,
  onResponseReceived
}: SubmitSmartBarMessageOptions): Promise<{ success: boolean, data?: any, error?: Error, transactionId: string }> {
  try {
    // Generate a transaction ID if not provided
    const msgTransactionId = transactionId || uuidv4();
    
    // Signal the start of submission
    if (onStart) onStart();

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Process uploaded files to create URLs
    const processedFiles = uploadedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.preview || 'mock-url-for-' + file.name
    }));

    // Validate agent IDs to ensure they're valid UUIDs
    const validAgentIds = agentIds
      ? agentIds.filter(id => id && typeof id === 'string' && isValidUUID(id))
      : [];

    // Add user message to the room immediately for optimistic update
    const userMessageResult = await supabase
      .from('room_messages')
      .insert({
        room_id: roomId,
        user_id: user.id,
        message_text: message,
        transaction_id: msgTransactionId
      })
      .select('*')
      .single();

    if (userMessageResult.error) {
      console.error('Error adding user message:', userMessageResult.error);
      throw userMessageResult.error;
    }

    // Prepare webhook payload
    const payload: WebhookPayload = {
      user_id: user.id,
      room_id: roomId,
      project_id: projectId,
      message,
      mode,
      language,
      files: processedFiles,
      agent_ids: validAgentIds,
      transaction_id: msgTransactionId
    };

    if (voiceUrl) payload.voice_url = voiceUrl;
    if (threadId) payload.thread_id = threadId;

    // Make API call to N8N webhook
    const response = await fetch('https://n8n.srv768178.hstgr.cloud/webhook-test/smartbar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Process the response and add AI message to the room
    if (onResponseReceived) {
      try {
        await onResponseReceived(responseData, msgTransactionId);
      } catch (responseErr) {
        console.error('Error in onResponseReceived callback:', responseErr);
      }
    }

    // Signal completion
    if (onComplete) onComplete();

    return { success: true, data: responseData, transactionId: msgTransactionId };
  } catch (error) {
    console.error('Error submitting message to N8N:', error);
    
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    if (onError) onError(errorObj);
    
    return { success: false, error: errorObj, transactionId: transactionId || uuidv4() };
  }
}

export async function addAiResponseToRoom(
  roomId: string, 
  agentId: string | null, 
  message: string,
  transactionId?: string
): Promise<RoomMessage | null> {
  try {
    // First verify we have an authenticated session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No active session for AI response insertion");
      // Return a mock message object so UI doesn't break
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
    
    // Ensure agentId is either a valid UUID or null
    // This fixes the "=voilia-one" error by ensuring we never send invalid UUIDs
    const validAgentId = agentId && isValidUUID(agentId) ? agentId : null;
    
    const { data, error } = await supabase
      .from("room_messages")
      .insert({
        room_id: roomId,
        agent_id: validAgentId,
        message_text: message,
        user_id: null, // Indicates this is an AI message
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
    // Don't show toast to avoid UI clutter after error
    
    // Return a temporary message object so the UI can still display something
    return {
      id: `temp-${Date.now()}`,
      room_id: roomId,
      user_id: null,
      agent_id: null, // Set to null instead of potentially invalid agent_id
      message_text: message,
      created_at: new Date().toISOString(),
      updated_at: null,
      messageType: 'agent',
      transaction_id: transactionId
    };
  }
}
