
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyMessagesState } from "@/components/rooms/EmptyMessagesState";
import { MessageGroup } from "@/components/rooms/MessageGroup";
import { MessageErrorBoundary } from "@/components/rooms/MessageErrorBoundary";
import { RoomMessage } from "@/types/room-messages";
import { useIsMobile } from "@/hooks/use-mobile";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface RoomMessagesContainerProps {
  isLoading: boolean;
  messages: { userId: string | null; messages: RoomMessage[] }[];
  roomName?: string;
  currentUserId?: string | null;
}

export const RoomMessagesContainer = forwardRef<HTMLDivElement, RoomMessagesContainerProps>(
  ({ isLoading, messages, roomName, currentUserId }, ref) => {
    const isMobile = useIsMobile();

    return (
      <ScrollArea className="h-full relative" ref={ref}>
        <ContentContainer className={cn(
          "py-4",
          isMobile ? "pb-[128px]" : "pb-[160px]",
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
                  />
                ))}
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
