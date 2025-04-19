
import { useState, useEffect, useCallback } from "react";
import { RoomMessage } from "@/types/room-messages";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/components/auth/AuthProvider";
import { useMessageGroups } from "@/hooks/messages/useMessageGroups";
import { DEMO_ROOM_ID, DEMO_AGENT_ID } from "@/config/demo-constants";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Sample welcome message from the demo agent
const WELCOME_MESSAGES = [
  "Welcome to the VOILIA Demo Room! I'm your Demo Agent, here to show you around. Try asking me about features, or how I can help your team work better together.",
  "Hello! This is the new VOILIA experience. Feel free to send me messages, upload files, or ask questions about how VOILIA can enhance your workflow."
];

export function useDemoRoomState() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const messageGroups = useMessageGroups(messages, user?.id);

  // Initialize the chat with a welcome message
  useEffect(() => {
    console.log("Initializing demo room with welcome message");
    const welcomeMessageIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    const welcomeMessage: RoomMessage = {
      id: `welcome-${Date.now()}`,
      room_id: DEMO_ROOM_ID,
      user_id: null,
      agent_id: DEMO_AGENT_ID,
      message_text: WELCOME_MESSAGES[welcomeMessageIndex],
      created_at: new Date().toISOString(),
      updated_at: null,
      transaction_id: `welcome-${uuidv4()}`,
      messageType: 'agent',
      isPending: false
    };
    
    // Add welcome message with a short delay to simulate agent response
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, welcomeMessage]);
      setIsLoading(false);
      console.log("Welcome message added");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Set up real-time message subscription for the demo room
  useEffect(() => {
    console.log("Setting up real-time message subscription");
    
    const channel = supabase
      .channel(`demo_room_${DEMO_ROOM_ID}`)
      .on('broadcast', { event: 'demo_message' }, (payload) => {
        if (payload.payload && typeof payload.payload === 'object') {
          const newMessage: RoomMessage = {
            id: `realtime-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            room_id: DEMO_ROOM_ID,
            user_id: null,
            agent_id: DEMO_AGENT_ID,
            message_text: payload.payload.message,
            created_at: new Date().toISOString(),
            updated_at: null,
            transaction_id: payload.payload.transactionId || uuidv4(),
            messageType: 'agent',
            isPending: false
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      })
      .subscribe((status) => {
        console.log("Supabase channel subscription status:", status);
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add a local message from the user
  const addLocalMessage = useCallback((message: RoomMessage) => {
    console.log("Adding local message to demo room:", message.message_text);
    setMessages(prev => [...prev, message]);
  }, []);

  // Start typing indicator
  const startTypingIndicator = useCallback(() => {
    setIsTyping(true);
  }, []);

  // Stop typing indicator
  const stopTypingIndicator = useCallback(() => {
    setIsTyping(false);
  }, []);

  // Handle sending a message with webhook integration
  const sendMessage = useCallback(async (text: string, files?: File[]) => {
    if (!text.trim() && (!files || files.length === 0)) return;
    
    const transactionId = uuidv4();
    console.log("Sending message in demo room:", text);
    
    // Create optimistic user message
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
    
    // Add user message to state
    addLocalMessage(userMessage);
    
    try {
      // Show typing indicator
      startTypingIndicator();
      
      // Process any files if needed (simplified for demo)
      const fileInfo = files?.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })) || [];
      
      // Simulate webhook call to N8N
      const webhookResponse = await simulateWebhookCall(text, fileInfo, transactionId);
      
      if (webhookResponse) {
        // Process the response after a short delay to simulate network latency
        setTimeout(() => {
          stopTypingIndicator();
          
          // Generate an appropriate response based on the message text
          const agentResponse = generateDemoResponse(text);
          
          // Add agent response
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

// Simulate a webhook call to N8N
async function simulateWebhookCall(
  message: string, 
  files: Array<{name: string, type: string, size: number}> = [],
  transactionId: string
): Promise<boolean> {
  console.log("Simulating webhook call to N8N:", { message, files, transactionId });
  
  // Simulate a delay of 500ms for the "network" request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate 95% success rate
  const isSuccess = Math.random() < 0.95;
  
  if (!isSuccess) {
    throw new Error("Simulated webhook failure");
  }
  
  return true;
}

// Generate a demo response based on user input
function generateDemoResponse(userMessage: string): string {
  const normalizedMessage = userMessage.toLowerCase();
  
  // Sample responses based on keywords
  if (normalizedMessage.includes("hello") || normalizedMessage.includes("hi")) {
    return "Hello there! I'm the Demo Agent for VOILIA. How can I assist you today?";
  }
  
  if (normalizedMessage.includes("help") || normalizedMessage.includes("how")) {
    return "I can help you explore VOILIA's capabilities! Ask me about messaging, file sharing, agent collaboration, or any other features you're curious about.";
  }
  
  if (normalizedMessage.includes("feature") || normalizedMessage.includes("what can you do")) {
    return "VOILIA offers real-time messaging, file sharing, smart AI agents, project management, and seamless integrations with tools like N8N. What specific feature would you like to know more about?";
  }
  
  if (normalizedMessage.includes("file") || normalizedMessage.includes("upload")) {
    return "You can upload files directly in the chat by clicking the paperclip icon, dragging and dropping files, or pasting content. All files are securely stored and accessible to your team.";
  }
  
  if (normalizedMessage.includes("agent") || normalizedMessage.includes("ai")) {
    return "VOILIA's AI agents can assist with various tasks based on their specializations. You can add multiple agents to a room to collaborate on complex problems or specific workflows.";
  }
  
  if (normalizedMessage.includes("project") || normalizedMessage.includes("team")) {
    return "Projects in VOILIA help organize your work. You can create rooms within projects, add team members with different roles, and customize your workspace to fit your team's needs.";
  }
  
  if (normalizedMessage.includes("webhook") || normalizedMessage.includes("n8n") || normalizedMessage.includes("integration")) {
    return "VOILIA integrates seamlessly with N8N through webhooks, allowing you to build custom workflows that connect with your other tools and automate routine tasks.";
  }
  
  if (normalizedMessage.includes("thank")) {
    return "You're welcome! Let me know if you have any other questions about VOILIA.";
  }
  
  // Default response for anything else
  return "That's an interesting point! VOILIA is designed to enhance team collaboration through smart messaging and AI assistance. Is there anything specific about the platform you'd like to explore?";
}
