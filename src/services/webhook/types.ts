
export interface WebhookPayload {
  user_id: string;
  room_id: string;
  project_id: string | null;
  message: string;
  mode: string;
  language: string;
  files: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  voice_url?: string;
  thread_id?: string;
  agent_ids: string[];
  transaction_id: string;
}

export interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: Error;
  transactionId: string;
}

export interface MessageSubmitOptions {
  message: string;
  roomId: string;
  projectId: string | null;
  mode: string;
  uploadedFiles?: Array<{
    id: string;
    file: File;
    name: string;
    type: string;
    size: number;
    preview: string | null;
  }>;
  voiceUrl?: string;
  threadId?: string;
  agentIds?: string[];
  language?: string;
  transactionId?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onResponseReceived?: (response: any, transactionId: string) => void;
}
