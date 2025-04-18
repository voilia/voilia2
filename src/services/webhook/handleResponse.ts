
import { WebhookResponse, MessageSubmitOptions } from "./types";

export async function handleWebhookResponse(
  response: Response,
  options: MessageSubmitOptions,
  transactionId: string
): Promise<WebhookResponse> {
  // For no-cors responses, check the type differently to avoid TypeScript error
  // Response.type can be "opaque" in no-cors mode, but TypeScript doesn't know this
  if (response.type === "opaque" as any) {
    console.log("Received opaque response from webhook (expected with no-cors)");
    
    // Create a simulated response for the initial message acknowledgement
    const initialResponse = {
      success: true,
      status: "processing",
      message: "Message sent successfully, awaiting response..."
    };

    // Call the onResponseReceived callback with this initial response
    if (options.onResponseReceived) {
      try {
        await options.onResponseReceived(initialResponse, transactionId);
      } catch (responseErr) {
        console.error('Error in onResponseReceived callback:', responseErr);
      }
    }

    // For no-cors mode, we need to implement optimistic updates since we can't parse the response
    // The actual AI response will be received via the real-time subscription
    
    if (options.onComplete) {
      options.onComplete();
    }

    return { 
      success: true, 
      data: initialResponse,
      transactionId 
    };
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Failed to send message: ${response.status} ${response.statusText} - ${errorText}`);
  }

  let responseData;
  try {
    // For no-cors responses, we may not be able to parse JSON
    if (response.type === "opaque" as any) {
      console.log("Received opaque response from webhook (expected with no-cors)");
      responseData = { 
        success: true,
        message: "Request processed. Due to CORS restrictions, detailed response unavailable.",
        status: "sent" 
      };
    } else {
      responseData = await response.json();
      console.log("Parsed webhook response:", responseData);
      
      // Handle specific response format from n8n
      if (responseData && responseData.success === true && responseData.response) {
        console.log("Response format detected from n8n:", responseData.response);
      }
    }
  } catch (jsonError) {
    console.error("Error parsing webhook response:", jsonError);
    // Provide a fallback for no-cors mode
    responseData = { 
      success: true,
      message: "Request sent. Unable to parse response due to CORS restrictions.",
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
