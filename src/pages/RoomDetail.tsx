
import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useCallback, useState } from "react";
import { useRoom } from "@/hooks/useRoom";
import { MainLayout } from "@/app/layout/MainLayout";
import { SmartBar } from "@/components/smart-bar/SmartBar";
import { SmartBarProvider } from "@/components/smart-bar/context/SmartBarContext";
import { FileDropZone } from "@/components/smart-bar/file-upload/FileDropZone";
import { useThrottle } from "@/components/smart-bar/buttons/mode-selector/hooks/useThrottle";
import { useRoomDetailMessages } from "@/hooks/useRoomDetailMessages";
import { RoomDetailHeader } from "@/components/rooms/detail/RoomDetailHeader";
import { RoomMessagesContainer } from "@/components/rooms/RoomMessagesContainer";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: room, isLoading: isRoomLoading } = useRoom(id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [prevMessageCount, setPrevMessageCount] = useState<number>(0);
  
  const {
    messageGroups,
    isLoading: isMessagesLoading,
    isProcessing,
    handleSendMessage,
    addLocalMessage
  } = useRoomDetailMessages(id, room?.project_id || null);

  // Enhanced scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, []);

  // Throttled scroll for performance during rapid updates
  const throttledScrollToBottom = useThrottle(scrollToBottom, 50);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    // Calculate total messages across all groups
    const currentMessageCount = messageGroups.reduce(
      (sum, group) => sum + group.messages.length, 
      0
    );
    
    // Only scroll if count has increased (new messages)
    if (currentMessageCount > prevMessageCount) {
      console.log("New messages detected, scrolling to bottom");
      throttledScrollToBottom();
      // Force another scroll after a slight delay to ensure all content is rendered
      setTimeout(scrollToBottom, 100);
    }
    
    // Update previous count
    setPrevMessageCount(currentMessageCount);
  }, [messageGroups, prevMessageCount, throttledScrollToBottom, scrollToBottom]);

  // Additional effect to ensure scroll happens after render
  useEffect(() => {
    // Initial scroll
    scrollToBottom();
    
    // Safety timeout to ensure messages are fully rendered
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [scrollToBottom]);

  // Check for authentication
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Authentication required", {
        description: "Please log in to view room details"
      });
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const isLoading = isRoomLoading || isMessagesLoading || authLoading;

  // Don't render content if not authenticated
  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading...</div>
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
          <RoomDetailHeader
            isLoading={isRoomLoading}
            roomName={room?.name}
            projectId={room?.project_id}
            projectName={room?.projects?.name}
            projectColor={room?.projects?.color}
            onBackClick={() => navigate(-1)}
          />

          <FileDropZone>
            <div className="flex-1 overflow-hidden relative">
              <RoomMessagesContainer
                ref={scrollAreaRef}
                isLoading={isLoading}
                isProcessing={isProcessing}
                messages={messageGroups}
                roomName={room?.name}
                currentUserId={user?.id}
              />
            </div>
          </FileDropZone>

          <SmartBar 
            onSendMessage={handleSendMessage} 
            isDisabled={isLoading} 
            projectId={room?.project_id || null}
            addLocalMessage={addLocalMessage}
            room={room}
            isLoading={isLoading}
          />
        </div>
      </SmartBarProvider>
    </MainLayout>
  );
}
