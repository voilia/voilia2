
import { useEffect, useState } from "react";
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
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    messages, 
    isLoading: messagesLoading, 
    addLocalMessage, 
    refetchMessages
  } = useRoomMessages(roomId);

  const messageGroups = useMessageGroups(messages, user?.id);
  const handleWebhookResponse = useWebhookHandler(roomId, projectId, addLocalMessage);
  
  // Message sender with processing state update
  const { 
    handleSendMessage: innerHandleSendMessage, 
    isProcessing: senderProcessing 
  } = useMessageSender(
    roomId,
    projectId,
    addLocalMessage,
    handleWebhookResponse
  );

  // Update processing state from message sender
  useEffect(() => {
    setIsProcessing(senderProcessing);
  }, [senderProcessing]);

  // Custom send message handler that tracks processing state
  const handleSendMessage = async (text: string, files?: File[]) => {
    setIsProcessing(true);
    try {
      await innerHandleSendMessage(text, files);
    } finally {
      // Don't set processing to false here - let the message sender handle it
      // when it actually receives the response
    }
  };

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
    isLoading: messagesLoading || authLoading,
    isProcessing,
    handleSendMessage,
    addLocalMessage
  };
}
