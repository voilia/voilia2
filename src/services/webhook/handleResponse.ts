
import { WebhookResponse, MessageSubmitOptions } from "./types";

export async function handleWebhookResponse(
  response: Response,
  options: MessageSubmitOptions,
  transactionId: string
): Promise<WebhookResponse> {
  // For no-cors responses, we cannot read the response body
  if (response.type === "opaque" as any) {
    console.log("Received opaque response from webhook (expected with no-cors)");
    
    // Create a response object for handling no-cors response
    const placeholderResponse = {
      success: true,
      status: "processing",
      message: "AI is processing your request...", // Use a helpful message
      internal: false, // Don't mark as internal so it shows up
      transactionId
    };

    // Call the onResponseReceived callback with the placeholder response
    if (options.onResponseReceived) {
      try {
        console.log("Calling onResponseReceived with temporary placeholder response");
        // Add a small delay to ensure state updates happen
        setTimeout(async () => {
          await options.onResponseReceived?.(placeholderResponse, transactionId);
          
          // After a few seconds, if there's been no real-time update,
          // send a follow-up message to inform the user
          setTimeout(async () => {
            // This will only display if no other message has replaced it
            const followupResponse = {
              success: true,
              status: "awaiting",
              message: "Your response is being processed. It will appear shortly.",
              transactionId: `${transactionId}-followup`,
              isPending: true
            };
            await options.onResponseReceived?.(followupResponse, `${transactionId}-followup`);
          }, 3000);
        }, 10);
      } catch (responseErr) {
        console.error('Error in onResponseReceived callback:', responseErr);
      }
    }

    // For no-cors mode, we rely on real-time subscriptions for the actual response
    // The actual AI response will be received via the Supabase real-time subscription
    
    if (options.onComplete) {
      options.onComplete();
    }

    return { 
      success: true, 
      data: placeholderResponse,
      transactionId 
    };
  }

  // Handle standard responses (when not using no-cors)
  try {
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`Failed to send message: ${response.status} ${response.statusText} - ${errorText}`);
    }

    let responseData;
    try {
      responseData = await response.json();
      console.log("Parsed webhook response:", responseData);
    } catch (jsonError) {
      console.error("Error parsing webhook response:", jsonError);
      responseData = { 
        success: true,
        message: "Request sent. Response received but couldn't be parsed.",
        status: "sent"
      };
    }
    
    // Add a small delay to ensure state updates happen in sequence
    if (options.onResponseReceived) {
      try {
        console.log("Calling onResponseReceived with data:", responseData);
        // Only 10ms delay to ensure UI has a chance to update
        setTimeout(async () => {
          await options.onResponseReceived?.(responseData, transactionId);
        }, 10);
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
  } catch (error) {
    console.error("Error handling webhook response:", error);
    if (options.onError) {
      options.onError(error instanceof Error ? error : new Error(String(error)));
    }
    throw error;
  }
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
