
export async function simulateWebhookCall(
  message: string, 
  files: Array<{name: string, type: string, size: number}> = [],
  transactionId: string
): Promise<boolean> {
  console.log("Simulating webhook call to N8N:", { message, files, transactionId });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const isSuccess = Math.random() < 0.95;
  
  if (!isSuccess) {
    throw new Error("Simulated webhook failure");
  }
  
  return true;
}
