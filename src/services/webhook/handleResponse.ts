
import { WebhookResponse, MessageSubmitOptions } from "./types";

export async function handleWebhookResponse(
  response: Response,
  options: MessageSubmitOptions,
  transactionId: string
): Promise<WebhookResponse> {
  // For no-cors responses, we cannot read the response body directly
  if (response.type === "opaque" as any) {
    console.log("Received opaque response from webhook (expected with no-cors)");
    
    // Instead of creating a placeholder, just silently return success
    // The real response will come through the real-time subscription
    
    if (options.onComplete) {
      options.onComplete();
    }

    return { 
      success: true, 
      data: {
        success: true,
        status: "processing",
        internal: true // Mark as internal so it won't display
      },
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
    
    // Process response immediately without delay
    if (options.onResponseReceived) {
      try {
        console.log("Calling onResponseReceived with data:", responseData);
        // Use requestAnimationFrame for more reliable UI updates
        requestAnimationFrame(() => {
          options.onResponseReceived?.(responseData, transactionId);
        });
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
