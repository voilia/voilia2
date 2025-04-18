
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { MessageGroup } from "@/components/rooms/MessageGroup";
import { EmptyMessagesState } from "@/components/rooms/EmptyMessagesState";
import { Skeleton } from "@/components/ui/skeleton";
import { RoomMessage } from "@/types/room-messages";
import { RefObject } from "react";
import { cn } from "@/lib/utils";

interface SmartBarMessagesProps {
  isLoading: boolean;
  messageGroups: { userId: string | null; messages: RoomMessage[] }[];
  roomName?: string;
  scrollAreaRef: RefObject<HTMLDivElement>;
  isMobile: boolean;
  currentUserId?: string | null;
}

export function SmartBarMessages({ 
  isLoading, 
  messageGroups, 
  roomName, 
  scrollAreaRef,
  isMobile,
  currentUserId
}: SmartBarMessagesProps) {
  return (
    <ScrollArea 
      className="h-full z-0" 
      ref={scrollAreaRef}
      data-testid="smart-bar-messages"
    >
      <ContentContainer className={cn(
        "py-4",
        isMobile ? "pb-[220px]" : "pb-[240px]"
      )}>
        {isLoading && messageGroups.length === 0 ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-12 w-1/2 ml-auto" />
            <Skeleton className="h-12 w-3/4" />
          </div>
        ) : messageGroups.length > 0 ? (
          <div className="space-y-4">
            {messageGroups.map((group, i) => (
              <MessageGroup 
                key={`${group.userId}-${i}`} 
                messages={group.messages} 
                isUserGroup={group.userId === currentUserId}
              />
            ))}
          </div>
        ) : (
          <EmptyMessagesState roomName={roomName} />
        )}
      </ContentContainer>
    </ScrollArea>
  );
}
