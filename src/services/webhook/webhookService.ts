
import { supabase } from "@/integrations/supabase/client";
import { WebhookResponse, MessageSubmitOptions } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { prepareWebhookPayload } from "./preparePayload";
import { handleWebhookResponse, handleWebhookError } from "./handleResponse";

export async function submitSmartBarMessage(options: MessageSubmitOptions): Promise<WebhookResponse> {
  try {
    if (options.onStart) options.onStart();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }

    const msgTransactionId = options.transactionId || uuidv4();

    // Add user message to room immediately for optimistic update
    const userMessageResult = await supabase
      .from('room_messages')
      .insert({
        room_id: options.roomId,
        user_id: user.id,
        message_text: options.message,
        transaction_id: msgTransactionId
      })
      .select('*')
      .single();

    if (userMessageResult.error) {
      console.error('Error adding user message:', userMessageResult.error);
      throw userMessageResult.error;
    }

    // Prepare webhook payload
    const payload = await prepareWebhookPayload({
      ...options,
      transactionId: msgTransactionId
    });
    payload.user_id = user.id;

    // Send request to webhook
    const response = await fetch('https://n8n.srv768178.hstgr.cloud/webhook-test/smartbar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleWebhookResponse(response, options, msgTransactionId);
  } catch (error) {
    return handleWebhookError(error, options, options.transactionId || uuidv4());
  }
}
