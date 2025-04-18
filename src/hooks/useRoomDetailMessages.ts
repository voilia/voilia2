
import { useState, useEffect } from "react";
import { RoomMessage, useRoomMessages } from "@/hooks/useRoomMessages";
import { useAuth } from "@/components/auth/AuthProvider";
import { submitSmartBarMessage } from "@/services/webhook/webhookService";
import { addAiResponseToRoom } from "@/services/messages/roomMessages";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export function useRoomDetailMessages(roomId: string | undefined, projectId: string | null) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageGroups, setMessageGroups] = useState<{ userId: string | null; messages: RoomMessage[] }[]>([]);
  const { messages, isLoading, addLocalMessage } = useRoomMessages(roomId);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Authentication required", {
        description: "Please log in to view room details"
      });
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Group messages by sender
  useEffect(() => {
    if (!messages?.length) {
      setMessageGroups([]);
      return;
    }

    console.log("Grouping messages:", messages.length);
    
    // Sort messages by creation time to ensure correct order
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const groups: { userId: string | null; messages: RoomMessage[] }[] = [];
    let currentGroup: { userId: string | null; messages: RoomMessage[] } | null = null;

    sortedMessages.forEach((message) => {
      // Skip messages without content
      if (!message.message_text?.trim()) return;
      
      const isFromCurrentUser = message.user_id === user?.id;
      // For user messages, use user_id; for agent messages, use agent_id or null
      const senderId = isFromCurrentUser ? user?.id : message.agent_id || null;
      
      if (!currentGroup || currentGroup.userId !== senderId) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { userId: senderId, messages: [message] };
      } else {
        currentGroup.messages.push(message);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    setMessageGroups(groups);
  }, [messages, user?.id]);

  // Handler for webhook responses
  const handleWebhookResponse = async (response: any, transactionId: string) => {
    if (!roomId || !user) return;
    
    console.log("Received webhook response:", response);
    
    try {
      if (response.message) {
        const agentId = response.agent_id && 
          typeof response.agent_id === 'string' && 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(response.agent_id) 
            ? response.agent_id 
            : null;
        
        // Create optimistic AI message for immediate display
        const optimisticAiMessage: RoomMessage = {
          id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          room_id: roomId,
          user_id: null,
          agent_id: agentId,
          message_text: response.message,
          created_at: new Date().toISOString(),
          updated_at: null,
          messageType: 'agent',
          transaction_id: transactionId,
          isPending: true
        };
        
        // Add AI response immediately with pending state
        console.log("Adding optimistic AI response:", optimisticAiMessage);
        addLocalMessage(optimisticAiMessage);
        
        // Save the response to the database
        await addAiResponseToRoom(
          roomId, 
          agentId, 
          response.message,
          transactionId
        );
      } else if (response.error) {
        console.error("Error in webhook response:", response.error);
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error processing webhook response:", error);
      toast.error("Failed to process AI response");
    }
  };
  
  // Handler for sending messages
  const handleSendMessage = async (text: string, files?: File[]) => {
    if (!roomId || !text.trim()) return;
    
    // Check if user is authenticated
    if (!user && !authLoading) {
      toast.error("Authentication required", {
        description: "Please log in to send messages"
      });
      navigate('/auth');
      return;
    }
    
    setIsProcessing(true);
    const transactionId = uuidv4();
    
    // Create and display optimistic user message immediately
    const optimisticUserMessage: RoomMessage = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      room_id: roomId,
      user_id: user?.id || null,
      agent_id: null,
      message_text: text,
      created_at: new Date().toISOString(),
      updated_at: null,
      messageType: 'user',
      transaction_id: transactionId,
      isPending: true
    };
    
    // Add user message immediately
    console.log("Adding optimistic user message:", optimisticUserMessage);
    addLocalMessage(optimisticUserMessage);
    
    try {
      let finalText = text;
      if (files && files.length > 0) {
        const fileNames = files.map(f => f.name).join(", ");
        finalText = `${text}\n\nAttached files: ${fileNames}`;
      }
      
      console.log("Submitting message to webhook:", finalText);
      
      const result = await submitSmartBarMessage({
        message: finalText,
        roomId,
        projectId,
        mode: 'chat',
        uploadedFiles: files?.map(file => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          preview: URL.createObjectURL(file)
        })) || [],
        onResponseReceived: handleWebhookResponse,
        transactionId
      });
      
      if (!result.success && result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
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
