
import { supabase } from "@/integrations/supabase/client";
import { WebhookResponse, MessageSubmitOptions } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { prepareWebhookPayload } from "./preparePayload";
import { handleWebhookResponse, handleWebhookError } from "./handleResponse";
import { toast } from "sonner";

export async function submitSmartBarMessage(options: MessageSubmitOptions): Promise<WebhookResponse> {
  try {
    if (options.onStart) options.onStart();

    // Get current user session with improved error handling
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      toast.error("Authentication error", {
        description: sessionError.message || "Failed to verify your session"
      });
      return handleWebhookError(new Error(sessionError.message), options, options.transactionId || uuidv4());
    }
    
    if (!session || !session.user) {
      const error = new Error("You must be logged in to send messages");
      toast.error("Authentication required", {
        description: "Please log in to send messages"
      });
      return handleWebhookError(error, options, options.transactionId || uuidv4());
    }

    const user = session.user;
    const msgTransactionId = options.transactionId || uuidv4();

    // Add user message to room with improved error handling
    const userMessageResult = await supabase
      .from('room_messages')
      .insert({
        room_id: options.roomId,
        user_id: user.id,
        message_text: options.message,
        transaction_id: msgTransactionId
      });

    if (userMessageResult.error) {
      console.error('Error adding user message:', userMessageResult.error);
      toast.error("Failed to save your message", {
        description: userMessageResult.error.message || "Database error occurred"
      });
      throw userMessageResult.error;
    }

    // Prepare webhook payload
    const payload = await prepareWebhookPayload({
      ...options,
      transactionId: msgTransactionId
    });
    payload.user_id = user.id;

    // Send request to webhook with improved error handling
    try {
      const response = await fetch('https://n8n.srv768178.hstgr.cloud/webhook-test/smartbar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`Webhook server error: ${response.status} ${response.statusText}`);
      }
      
      return handleWebhookResponse(response, options, msgTransactionId);
    } catch (fetchError) {
      console.error('Network error when calling webhook:', fetchError);
      toast.error("Connection error", {
        description: "Could not connect to the AI service. Please try again later."
      });
      throw fetchError;
    }
  } catch (error) {
    console.error('Error submitting message:', error);
    toast.error("Failed to send message", {
      description: error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null
          ? JSON.stringify(error)
          : "An unexpected error occurred"
    });
    return handleWebhookError(error, options, options.transactionId || uuidv4());
  }
}
