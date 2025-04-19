
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyMessagesState } from "@/components/rooms/EmptyMessagesState";
import { MessageGroup } from "@/components/rooms/MessageGroup";
import { MessageErrorBoundary } from "@/components/rooms/MessageErrorBoundary";
import { ThinkingIndicator } from "@/components/rooms/ThinkingIndicator";
import { RoomMessage } from "@/types/room-messages";
import { useIsMobile } from "@/hooks/use-mobile";
import { forwardRef, useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

interface RoomMessagesContainerProps {
  isLoading: boolean;
  messages: { userId: string | null; messages: RoomMessage[] }[];
  roomName?: string;
  currentUserId?: string | null;
  isProcessing?: boolean;
}

export const RoomMessagesContainer = forwardRef<HTMLDivElement, RoomMessagesContainerProps>(
  ({ isLoading, messages, roomName, currentUserId, isProcessing }, ref) => {
    const isMobile = useIsMobile();
    const [showThinking, setShowThinking] = useState(false);
    
    // Find the latest message group and its index
    const latestGroupIndex = useMemo(() => {
      if (!messages.length) return -1;
      
      // Find the group with the latest timestamp
      let latestIndex = 0;
      let latestTime = 0;
      
      messages.forEach((group, index) => {
        if (group.messages.length > 0) {
          const groupLatestMessage = group.messages[group.messages.length - 1];
          const timestamp = new Date(groupLatestMessage.created_at).getTime();
          if (timestamp > latestTime) {
            latestTime = timestamp;
            latestIndex = index;
          }
        }
      });
      
      return latestIndex;
    }, [messages]);
    
    // Show thinking indicator when messages are processing
    useEffect(() => {
      let timer: NodeJS.Timeout;
      
      if (isProcessing) {
        // Delay showing the thinking indicator slightly to prevent flashing
        timer = setTimeout(() => {
          setShowThinking(true);
        }, 500);
      } else {
        setShowThinking(false);
      }
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [isProcessing]);

    return (
      <ScrollArea 
        className="h-full relative z-0" 
        ref={ref}
        data-testid="room-messages-container"
      >
        <ContentContainer className={cn(
          "py-4",
          isMobile ? "pb-[220px]" : "pb-[240px]",
          "relative"
        )}>
          {isLoading && messages.length === 0 ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-12 w-1/2 ml-auto" />
              <Skeleton className="h-12 w-3/4" />
            </div>
          ) : messages.length > 0 ? (
            <MessageErrorBoundary>
              <div className="space-y-4">
                {messages.map((group, i) => (
                  <MessageGroup 
                    key={`${group.userId}-${i}`} 
                    messages={group.messages} 
                    isUserGroup={group.userId === currentUserId}
                    isLatestGroup={i === latestGroupIndex}
                  />
                ))}
                
                {/* Show thinking indicator at the end */}
                {showThinking && !messages[latestGroupIndex]?.userId && (
                  <ThinkingIndicator align="left" />
                )}
              </div>
            </MessageErrorBoundary>
          ) : (
            <EmptyMessagesState roomName={roomName} />
          )}
        </ContentContainer>
      </ScrollArea>
    );
  }
);

RoomMessagesContainer.displayName = "RoomMessagesContainer";
