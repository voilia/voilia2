
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useRoomMessages } from "@/hooks/useRoomMessages";
import { useMessageGroups } from "@/hooks/messages/useMessageGroups";
import { useWebhookHandler } from "@/hooks/messages/useWebhookHandler";
import { useMessageSender } from "@/hooks/messages/useMessageSender";
import { toast } from "sonner";

export function useRoomDetailMessages(roomId: string | undefined, projectId: string | null) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const { 
    messages, 
    isLoading: messagesLoading, 
    addLocalMessage, 
    refetchMessages
  } = useRoomMessages(roomId);

  const messageGroups = useMessageGroups(messages, user?.id);
  const handleWebhookResponse = useWebhookHandler(roomId, projectId, addLocalMessage);
  const { handleSendMessage, isProcessing } = useMessageSender(
    roomId,
    projectId,
    addLocalMessage,
    handleWebhookResponse
  );

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Authentication required", {
        description: "Please log in to view room details"
      });
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  return {
    messageGroups,
    isLoading: messagesLoading || isProcessing || authLoading,
    handleSendMessage,
    addLocalMessage
  };
}
