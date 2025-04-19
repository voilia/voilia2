
import { WebhookResponse, MessageSubmitOptions } from "./types";

export async function handleWebhookResponse(
  response: Response,
  options: MessageSubmitOptions,
  transactionId: string
): Promise<WebhookResponse> {
  // For no-cors responses, we cannot read the response body directly
  if (response.type === "opaque" as any) {
    console.log("Received opaque response from webhook (expected with no-cors)");
    
    // Instead of creating a placeholder, just silently wait for real-time update
    // This avoids any race conditions or duplicate messages
    
    if (options.onComplete) {
      options.onComplete();
    }

    // Still trigger onResponseReceived with a minimal message
    // to ensure we have a backup mechanism if real-time fails
    if (options.onResponseReceived) {
      // Delay to allow real-time to come in first, if available
      setTimeout(() => {
        const fallbackResponse = {
          success: true,
          data: {
            text: "Your message is being processed..."
          },
          internal: false, // Allow this to display as a fallback
          transactionId
        };
        
        options.onResponseReceived?.(fallbackResponse, transactionId);
      }, 2000); // Wait 2 seconds for real-time before showing fallback
    }

    return { 
      success: true, 
      data: {
        success: true,
        status: "processing",
        internal: true
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
    
    // Process response immediately for instant display
    if (options.onResponseReceived) {
      try {
        console.log("Calling onResponseReceived with data:", responseData);
        options.onResponseReceived?.(responseData, transactionId);
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
