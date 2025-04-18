
import { supabase } from "@/integrations/supabase/client";
import { WebhookResponse, MessageSubmitOptions } from "./types";

export async function handleWebhookResponse(
  response: Response,
  options: MessageSubmitOptions,
  transactionId: string
): Promise<WebhookResponse> {
  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  const responseData = await response.json();
  
  if (options.onResponseReceived) {
    try {
      await options.onResponseReceived(responseData, transactionId);
    } catch (responseErr) {
      console.error('Error in onResponseReceived callback:', responseErr);
    }
  }

  if (options.onComplete) {
    options.onComplete();
  }

  return { 
    success: true, 
    data: responseData, 
    transactionId 
  };
}

export function handleWebhookError(
  error: unknown,
  options: MessageSubmitOptions,
  transactionId: string
): WebhookResponse {
  console.error('Error submitting message to N8N:', error);
  
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  if (options.onError) {
    options.onError(errorObj);
  }
  
  return { 
    success: false, 
    error: errorObj, 
    transactionId 
  };
}
