
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/app/layout/MainLayout";
import { SmartBarProvider } from "@/components/smart-bar/context/SmartBarContext";
import { FileDropZone } from "@/components/smart-bar/file-upload/FileDropZone";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { DemoRoomHeader } from "@/components/rooms/demo/DemoRoomHeader";
import { DemoRoomContent } from "@/components/rooms/demo/DemoRoomContent";
import { DemoSmartBar } from "@/components/rooms/demo/DemoSmartBar";
import { useDemoRoomState } from "@/hooks/demo/useDemoRoomState";
import { DEMO_AGENT_ID, DEMO_ROOM_ID } from "@/config/demo-constants";

export default function DemoRoom() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    messageGroups,
    isLoading,
    sendMessage,
    addLocalMessage,
    startTypingIndicator,
    stopTypingIndicator,
    isTyping
  } = useDemoRoomState();

  // Enhanced scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, []);

  // Scroll to bottom on initial load and when messageGroups changes
  useEffect(() => {
    scrollToBottom();
    // Additional delay scroll to ensure all content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messageGroups, scrollToBottom, isTyping]);

  // Check for authentication
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Authentication required", {
        description: "Please log in to access the demo room"
      });
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Handle the WebSocket message sending with optimistic UI updates
  const handleSendMessage = async (message: string, files?: File[]) => {
    try {
      // Display typing indicator before sending the actual response
      startTypingIndicator();
      
      // Send the message and get real-time response
      await sendMessage(message, files);
      
      // Scroll to bottom after new messages
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: "There was an issue with the demo agent. Please try again."
      });
    } finally {
      stopTypingIndicator();
    }
  };

  // Don't render content if not authenticated
  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading demo room...</div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Will redirect due to the useEffect above
  }

  return (
    <MainLayout>
      <SmartBarProvider>
        <div className="flex flex-col h-full w-full overflow-hidden max-w-full relative">
          <DemoRoomHeader 
            onBackClick={() => navigate(-1)} 
          />

          <FileDropZone>
            <div className="flex-1 overflow-hidden relative">
              <DemoRoomContent
                ref={scrollAreaRef}
                isLoading={isLoading}
                messages={messageGroups}
                currentUserId={user?.id}
                isTyping={isTyping}
              />
            </div>
          </FileDropZone>

          <DemoSmartBar 
            onSendMessage={handleSendMessage} 
            isDisabled={isLoading} 
            addLocalMessage={addLocalMessage}
          />
        </div>
      </SmartBarProvider>
    </MainLayout>
  );
}
