
import { supabase } from "@/integrations/supabase/client";
import { WebhookResponse, MessageSubmitOptions } from "./types";

export async function handleWebhookResponse(
  response: Response,
  options: MessageSubmitOptions,
  transactionId: string
): Promise<WebhookResponse> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Failed to send message: ${response.status} ${response.statusText} - ${errorText}`);
  }

  let responseData;
  try {
    responseData = await response.json();
  } catch (jsonError) {
    console.error("Error parsing webhook response:", jsonError);
    throw new Error("Invalid response from AI service");
  }
  
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
  
  // Transform error into a proper Error object with meaningful message
  let errorObj: Error;
  if (error instanceof Error) {
    errorObj = error;
  } else if (typeof error === 'object' && error !== null) {
    // Handle Supabase-style errors or other object errors
    const errorMessage = 
      error.hasOwnProperty('message') ? (error as any).message : 
      error.hasOwnProperty('error') ? (error as any).error :
      JSON.stringify(error);
    errorObj = new Error(errorMessage);
  } else {
    errorObj = new Error(String(error));
  }
  
  if (options.onError) {
    options.onError(errorObj);
  }
  
  return { 
    success: false, 
    error: errorObj, 
    transactionId 
  };
}
