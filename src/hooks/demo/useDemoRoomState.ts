
import { useState, useCallback } from "react";
import { RoomMessage } from "@/types/room-messages";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/components/auth/AuthProvider";
import { useMessageGroups } from "@/hooks/messages/useMessageGroups";
import { DEMO_ROOM_ID } from "@/config/demo-constants";
import { toast } from "sonner";
import { useWelcomeMessage } from "./useWelcomeMessage";
import { useRealtimeMessages } from "./useRealtimeMessages";
import { generateDemoResponse } from "./utils/demoResponses";
import { simulateWebhookCall } from "./useWebhookSimulation";

export function useDemoRoomState() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messageGroups = useMessageGroups(messages, user?.id);
  
  // Initialize welcome message
  const { isLoading } = useWelcomeMessage(setMessages);
  
  // Set up real-time message subscription
  useRealtimeMessages(setMessages);

  const addLocalMessage = useCallback((message: RoomMessage) => {
    console.log("Adding local message to demo room:", message.message_text);
    setMessages(prev => [...prev, message]);
  }, []);

  const startTypingIndicator = useCallback(() => {
    setIsTyping(true);
  }, []);

  const stopTypingIndicator = useCallback(() => {
    setIsTyping(false);
  }, []);

  const sendMessage = useCallback(async (text: string, files?: File[]) => {
    if (!text.trim() && (!files || files.length === 0)) return;
    
    const transactionId = uuidv4();
    console.log("Sending message in demo room:", text);
    
    const userMessage: RoomMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      room_id: DEMO_ROOM_ID,
      user_id: user?.id || 'demo-user',
      agent_id: null,
      message_text: text,
      created_at: new Date().toISOString(),
      updated_at: null,
      transaction_id: transactionId,
      messageType: 'user',
      isPending: false
    };
    
    addLocalMessage(userMessage);
    
    try {
      startTypingIndicator();
      
      const fileInfo = files?.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })) || [];
      
      const webhookResponse = await simulateWebhookCall(text, fileInfo, transactionId);
      
      if (webhookResponse) {
        setTimeout(() => {
          stopTypingIndicator();
          
          const agentResponse = generateDemoResponse(text);
          
          const agentMessage: RoomMessage = {
            id: `agent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            room_id: DEMO_ROOM_ID,
            user_id: null,
            agent_id: DEMO_AGENT_ID,
            message_text: agentResponse,
            created_at: new Date().toISOString(),
            updated_at: null,
            transaction_id: `${transactionId}-response`,
            messageType: 'agent',
            isPending: false
          };
          
          addLocalMessage(agentMessage);
        }, 1500);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      stopTypingIndicator();
      toast.error("Failed to send message", {
        description: "There was a problem with the demo agent. Please try again."
      });
    }
  }, [user, addLocalMessage, startTypingIndicator, stopTypingIndicator]);

  return {
    messages,
    messageGroups,
    isLoading,
    isTyping,
    sendMessage,
    addLocalMessage,
    startTypingIndicator,
    stopTypingIndicator
  };
}
