
import { supabase } from "@/integrations/supabase/client";
import { WebhookPayload, WebhookResponse, MessageSubmitOptions } from "./types";
import { validateAgentIds, processFiles } from "./utils";
import { v4 as uuidv4 } from 'uuid';

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
}: MessageSubmitOptions): Promise<WebhookResponse> {
  try {
    if (onStart) onStart();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }

    const msgTransactionId = transactionId || uuidv4();
    const validAgentIds = validateAgentIds(agentIds);
    const processedFiles = processFiles(uploadedFiles);

    // Add user message to room immediately for optimistic update
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
    
    if (onResponseReceived) {
      try {
        await onResponseReceived(responseData, msgTransactionId);
      } catch (responseErr) {
        console.error('Error in onResponseReceived callback:', responseErr);
      }
    }

    if (onComplete) onComplete();

    return { success: true, data: responseData, transactionId: msgTransactionId };
  } catch (error) {
    console.error('Error submitting message to N8N:', error);
    
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    if (onError) onError(errorObj);
    
    return { success: false, error: errorObj, transactionId: transactionId || uuidv4() };
  }
}
