
import { WebhookPayload, MessageSubmitOptions } from './types';
import { validateAgentIds, processFiles } from './utils';

export async function prepareWebhookPayload({
  message,
  roomId,
  projectId,
  mode,
  uploadedFiles = [],
  voiceUrl,
  threadId,
  agentIds = [],
  language = 'en',
  transactionId,
}: MessageSubmitOptions): Promise<WebhookPayload> {
  const validAgentIds = validateAgentIds(agentIds);
  const processedFiles = processFiles(uploadedFiles);

  const payload: WebhookPayload = {
    user_id: 'placeholder', // This will be replaced with actual user_id in webhookService
    room_id: roomId,
    project_id: projectId,
    message,
    mode,
    language,
    files: processedFiles,
    agent_ids: validAgentIds,
    transaction_id: transactionId
  };

  if (voiceUrl) payload.voice_url = voiceUrl;
  if (threadId) payload.thread_id = threadId;

  return payload;
}
