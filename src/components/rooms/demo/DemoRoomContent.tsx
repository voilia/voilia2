
import { forwardRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { MessageGroup } from "@/components/rooms/MessageGroup";
import { MessageErrorBoundary } from "@/components/rooms/MessageErrorBoundary";
import { EmptyMessagesState } from "@/components/rooms/EmptyMessagesState";
import { Skeleton } from "@/components/ui/skeleton";
import { RoomMessage } from "@/types/room-messages";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TypingIndicator } from "@/components/rooms/demo/TypingIndicator";

interface DemoRoomContentProps {
  isLoading: boolean;
  messages: { userId: string | null; messages: RoomMessage[] }[];
  currentUserId?: string | null;
  isTyping?: boolean;
}

export const DemoRoomContent = forwardRef<HTMLDivElement, DemoRoomContentProps>(
  ({ isLoading, messages, currentUserId, isTyping = false }, ref) => {
    const isMobile = useIsMobile();

    return (
      <ScrollArea 
        className="h-full relative z-0" 
        ref={ref}
        data-testid="demo-room-messages-container"
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
                  />
                ))}
                
                {isTyping && (
                  <div className="flex flex-col gap-1 py-2 max-w-full items-start">
                    <div className="flex flex-col max-w-[85%] space-y-1 items-start">
                      <div className="px-4 py-3 text-sm rounded-xl break-words bg-muted text-foreground mr-auto rounded-tl-none">
                        <TypingIndicator />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </MessageErrorBoundary>
          ) : (
            <div className="space-y-6">
              <EmptyMessagesState roomName="Demo Room" />
              <div className="text-center text-sm text-muted-foreground max-w-md mx-auto">
                <p>This is an interactive demo showcasing the new VOILIA room experience.</p>
                <p className="mt-2">Try sending a message to interact with the Demo Agent!</p>
              </div>
            </div>
          )}
        </ContentContainer>
      </ScrollArea>
    );
  }
);

DemoRoomContent.displayName = "DemoRoomContent";
