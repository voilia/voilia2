
import { supabase } from "@/integrations/supabase/client";
import { SmartBarMode, UploadedFile } from "@/components/smart-bar/types/smart-bar-types";
import { toast } from "sonner";
import { RoomMessage } from "@/hooks/useRoomMessages";

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
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onResponseReceived?: (response: any) => void;
}

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
  onStart,
  onComplete,
  onError,
  onResponseReceived
}: SubmitSmartBarMessageOptions): Promise<{ success: boolean, data?: any, error?: Error }> {
  try {
    // Signal the start of submission
    if (onStart) onStart();

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Process uploaded files to create URLs
    // In a real implementation, you'd upload these to storage and get permanent URLs
    // This is a simplified mock implementation
    const processedFiles = uploadedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.preview || 'mock-url-for-' + file.name // In real implementation: actual URL
    }));

    // Prepare payload
    const payload: WebhookPayload = {
      user_id: user.id,
      room_id: roomId,
      project_id: projectId,
      message,
      mode,
      language,
      files: processedFiles,
      agent_ids: agentIds,
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
    
    // Process the response
    if (onResponseReceived) {
      onResponseReceived(responseData);
    }

    // Signal completion
    if (onComplete) onComplete();

    return { success: true, data: responseData };
  } catch (error) {
    console.error('Error submitting message to N8N:', error);
    
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    if (onError) onError(errorObj);
    
    // Only show toast if no custom error handler
    if (!onError) {
      toast.error("Failed to process your message");
    }
    
    return { success: false, error: errorObj };
  }
}

// Helper function to add an AI response to the room
export async function addAiResponseToRoom(
  roomId: string, 
  agentId: string | null, 
  message: string
): Promise<RoomMessage | null> {
  try {
    const { data, error } = await supabase
      .from("room_messages")
      .insert({
        room_id: roomId,
        agent_id: agentId,
        message_text: message,
        user_id: null // Indicates this is an AI message
      })
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding AI response:", error);
    toast.error("Failed to display AI response");
    return null;
  }
}
