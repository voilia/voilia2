
import { useParams } from "react-router-dom";
import { useState } from "react";
import { UploadedFile, SmartBarMode } from "@/components/smart-bar/types/smart-bar-types";
import { submitSmartBarMessage, addAiResponseToRoom } from "@/services/n8nService";
import { useAuth } from "@/components/auth/AuthProvider";

interface UseN8nSmartBarOptions {
  projectId?: string | null;
  onAiResponseReceived?: (response: any) => void;
}

export function useN8nSmartBar(options: UseN8nSmartBarOptions = {}) {
  const { id: roomId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitMessage = async (
    message: string,
    mode: SmartBarMode,
    uploadedFiles: UploadedFile[] = [],
    voiceUrl?: string,
    threadId?: string,
    agentIds: string[] = []
  ) => {
    if (!roomId || !user) {
      throw new Error("Room ID or user not available");
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Validate agent IDs to ensure they're valid UUIDs
      const validAgentIds = agentIds.filter(id => 
        typeof id === 'string' && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      );

      const result = await submitSmartBarMessage({
        message,
        roomId,
        projectId: options.projectId || null,
        mode,
        uploadedFiles,
        voiceUrl,
        threadId,
        agentIds: validAgentIds,
        onResponseReceived: async (response) => {
          // Handle AI response - add it to the conversation
          if (response.message) {
            // Get a valid agent ID if available
            const agentId = response.agent_id && 
              typeof response.agent_id === 'string' && 
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(response.agent_id) 
                ? response.agent_id 
                : null;
                
            await addAiResponseToRoom(
              roomId, 
              agentId, 
              response.message
            );
          }
          
          // Call custom handler if provided
          if (options.onAiResponseReceived) {
            options.onAiResponseReceived(response);
          }
        }
      });

      if (!result.success && result.error) {
        throw result.error;
      }

      return result.data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    submitMessage,
    isProcessing,
    error
  };
}
