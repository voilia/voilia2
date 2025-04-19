
import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/app/layout/MainLayout";
import { SmartBarProvider } from "@/components/smart-bar/context/SmartBarContext";
import { FileDropZone } from "@/components/smart-bar/file-upload/FileDropZone";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { DemoRoomHeader } from "@/components/rooms/demo/DemoRoomHeader";
import { DemoRoomContent } from "@/components/rooms/demo/DemoRoomContent";
import { DemoSmartBar } from "@/components/rooms/demo/DemoSmartBar";
import { useDemoRoomState } from "@/hooks/demo/useDemoRoomState";
import { cn } from "@/lib/utils";

// Add hideSidebar prop to force sidebar closed in demo room
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

  console.log("DemoRoom rendering with messages:", messageGroups?.length || 0);

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

  // Simpler loading state - don't block the whole page
  if (authLoading) {
    return (
      <MainLayout hideSidebar>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading demo room...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideSidebar>
      <SmartBarProvider>
        <div className={cn(
          "flex flex-col h-full w-full overflow-hidden max-w-full relative",
          "bg-gradient-to-b from-background to-background/80"
        )}>
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
