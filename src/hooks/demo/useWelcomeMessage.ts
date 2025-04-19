
import { useState, useEffect } from "react";
import { RoomMessage } from "@/types/room-messages";
import { v4 as uuidv4 } from 'uuid';
import { DEMO_ROOM_ID, DEMO_AGENT_ID } from "@/config/demo-constants";

const WELCOME_MESSAGES = [
  "Welcome to the VOILIA Demo Room! I'm your Demo Agent, here to show you around. Try asking me about features, or how I can help your team work better together.",
  "Hello! This is the new VOILIA experience. Feel free to send me messages, upload files, or ask questions about how VOILIA can enhance your workflow."
];

export function useWelcomeMessage(setMessages: (messages: RoomMessage[]) => void) {
  const [isLoading, setIsLoading] = useState(true);

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
    
    const timer = setTimeout(() => {
      // Fix: Create a new array with the previous messages and the welcome message
      setMessages((prev) => {
        const updatedMessages = [...prev, welcomeMessage];
        return updatedMessages;
      });
      setIsLoading(false);
      console.log("Welcome message added");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [setMessages]);

  return { isLoading };
}
