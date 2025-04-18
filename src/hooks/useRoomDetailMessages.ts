
import { useState, useEffect } from "react";
import { RoomMessage, useRoomMessages } from "@/hooks/useRoomMessages";
import { useAuth } from "@/components/auth/AuthProvider";
import { submitSmartBarMessage } from "@/services/n8nService";
import { addAiResponseToRoom } from "@/services/messages/roomMessages";
import { toast } from "sonner";

export function useRoomDetailMessages(roomId: string | undefined, projectId: string | null) {
  const { user, loading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageGroups, setMessageGroups] = useState<{ userId: string | null; messages: RoomMessage[] }[]>([]);
  const { messages, isLoading, addLocalMessage } = useRoomMessages(roomId);

  // Group messages by sender
  useEffect(() => {
    if (!messages?.length) {
      setMessageGroups([]);
      return;
    }

    const groups: { userId: string | null; messages: RoomMessage[] }[] = [];
    let currentGroup: { userId: string | null; messages: RoomMessage[] } | null = null;

    messages.forEach((message) => {
      const isFromCurrentUser = 
        (message.messageType === 'user') || 
        (message.user_id === user?.id && message.user_id !== null);
      
      const senderId = isFromCurrentUser ? user?.id : message.agent_id || null;
      
      if (!currentGroup || 
          currentGroup.userId !== senderId || 
          (isFromCurrentUser !== (currentGroup.messages[0].user_id === user?.id))) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        
        currentGroup = { 
          userId: senderId, 
          messages: [message] 
        };
      } else {
        currentGroup.messages.push(message);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    setMessageGroups(groups);
  }, [messages, user?.id]);

  const handleWebhookResponse = async (response: any, transactionId: string) => {
    if (!roomId || !user) return;
    
    try {
      if (response.message) {
        const agentId = response.agent_id && 
          typeof response.agent_id === 'string' && 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(response.agent_id) 
            ? response.agent_id 
            : null;
        
        const optimisticAiMessage: RoomMessage = {
          id: `temp-${Date.now()}`,
          room_id: roomId,
          user_id: null,
          agent_id: agentId,
          message_text: response.message,
          created_at: new Date().toISOString(),
          updated_at: null,
          messageType: 'agent',
          transaction_id: transactionId
        };
        
        addLocalMessage(optimisticAiMessage);
        
        await addAiResponseToRoom(
          roomId, 
          agentId, 
          response.message,
          transactionId
        );
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error processing webhook response:", error);
      toast.error("Failed to process AI response");
    }
  };
  
  const handleSendMessage = async (text: string, files?: File[]) => {
    if (!roomId || !text.trim()) return;
    
    // Check if user is authenticated
    if (!user && !authLoading) {
      toast.error("Authentication required", {
        description: "Please log in to send messages"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      let finalText = text;
      if (files && files.length > 0) {
        const fileNames = files.map(f => f.name).join(", ");
        finalText = `${text}\n\nAttached files: ${fileNames}`;
      }
      
      const result = await submitSmartBarMessage({
        message: finalText,
        roomId,
        projectId,
        mode: 'chat',
        uploadedFiles: files?.map(file => ({
          id: `file-${Date.now()}`,
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          preview: URL.createObjectURL(file)
        })) || [],
        onResponseReceived: handleWebhookResponse
      });
      
      if (!result.success && result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    messageGroups,
    isLoading: isLoading || isProcessing || authLoading,
    handleSendMessage,
    addLocalMessage
  };
}
