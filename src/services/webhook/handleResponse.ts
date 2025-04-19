
import { WebhookResponse, MessageSubmitOptions } from "./types";

export async function handleWebhookResponse(
  response: Response,
  options: MessageSubmitOptions,
  transactionId: string
): Promise<WebhookResponse> {
  // For no-cors responses, we cannot read the response body
  if (response.type === "opaque" as any) {
    console.log("Received opaque response from webhook (expected with no-cors)");
    
    // Create a response object for internal handling - don't display to user
    const initialResponse = {
      success: true,
      status: "processing",
      message: "", // Empty message to avoid showing placeholder text
      internal: true // Mark this as internal to avoid displaying to user
    };

    // Call the onResponseReceived callback with this initial response
    if (options.onResponseReceived) {
      try {
        console.log("Calling onResponseReceived with empty initial response while waiting for real-time update");
        await options.onResponseReceived(initialResponse, transactionId);
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
      data: initialResponse,
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
    
    if (options.onResponseReceived) {
      try {
        console.log("Calling onResponseReceived with data:", responseData);
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
