
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRoom } from "@/hooks/useRoom";
import { RoomMessage, useRoomMessages } from "@/hooks/useRoomMessages";
import { useAuth } from "@/components/auth/AuthProvider";
import { MainLayout } from "@/app/layout/MainLayout";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { SmartBar } from "@/components/smart-bar/SmartBar";
import { MessageGroup } from "@/components/rooms/MessageGroup";
import { EmptyMessagesState } from "@/components/rooms/EmptyMessagesState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: room, isLoading: isRoomLoading } = useRoom(id);
  const { messages, isLoading: isMessagesLoading, sendMessage } = useRoomMessages(id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messageGroups, setMessageGroups] = useState<{ userId: string | null; messages: RoomMessage[] }[]>([]);

  useEffect(() => {
    if (!messages?.length) {
      setMessageGroups([]);
      return;
    }

    const groups: { userId: string | null; messages: RoomMessage[] }[] = [];
    let currentGroup: { userId: string | null; messages: RoomMessage[] } | null = null;

    messages.forEach((message) => {
      if (!currentGroup || currentGroup.userId !== message.user_id) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { userId: message.user_id, messages: [message] };
      } else {
        currentGroup.messages.push(message);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    setMessageGroups(groups);
  }, [messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messageGroups]);

  const handleSendMessage = async (text: string) => {
    if (!id) return;
    await sendMessage(text);
  };

  const isLoading = isRoomLoading || isMessagesLoading;

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-56px)] md:h-screen relative">
        <div className="bg-background/80 backdrop-blur-sm border-b border-border p-3 md:p-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isRoomLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <>
                <h1 className="text-lg font-semibold">{room?.name}</h1>
                {room?.projects && (
                  <Badge variant="outline" className="text-xs" style={{ 
                    backgroundColor: room.projects.color + "20", 
                    borderColor: room.projects.color 
                  }}>
                    {room.projects.name}
                  </Badge>
                )}
              </>
            )}
          </div>
          <Button size="icon" variant="ghost">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <ContentContainer className="py-4">
              {isLoading ? (
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
                      isUserGroup={group.userId === user?.id}
                    />
                  ))}
                </div>
              ) : (
                <EmptyMessagesState roomName={room?.name} />
              )}
            </ContentContainer>
          </ScrollArea>
        </div>

        <SmartBar onSendMessage={handleSendMessage} isDisabled={isLoading} />
      </div>
    </MainLayout>
  );
}
