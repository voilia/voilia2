
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SmartBarProvider } from "@/components/smart-bar/context/SmartBarContext";
import { FileDropZone } from "@/components/smart-bar/file-upload/FileDropZone";
import { toast } from "sonner";
import { useThrottle } from "@/components/smart-bar/buttons/mode-selector/hooks/useThrottle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileScroll } from "@/hooks/useMobileScroll";

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: room, isLoading: isRoomLoading } = useRoom(id);
  const { messages, isLoading: isMessagesLoading, sendMessage } = useRoomMessages(id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messageGroups, setMessageGroups] = useState<{ userId: string | null; messages: RoomMessage[] }[]>([]);
  const isMobile = useIsMobile();
  
  useMobileScroll();
  
  useEffect(() => {
    if (!messages?.length) {
      setMessageGroups([]);
      return;
    }

    const groups: { userId: string | null; messages: RoomMessage[] }[] = [];
    let currentGroup: { userId: string | null; messages: RoomMessage[] } | null = null;

    messages.forEach((message) => {
      // Explicitly determine if this message is from the current user
      const isFromCurrentUser = message.user_id === user?.id;
      
      // Start a new group if:
      // 1. This is the first message
      // 2. The previous group was from a different sender (user vs non-user)
      if (!currentGroup || 
          (isFromCurrentUser && currentGroup.userId !== user?.id) || 
          (!isFromCurrentUser && currentGroup.userId !== message.user_id)) {
        
        // Push the current group if it exists
        if (currentGroup) {
          groups.push(currentGroup);
        }
        
        // Create a new group
        currentGroup = { 
          userId: isFromCurrentUser ? user?.id : message.user_id, 
          messages: [message] 
        };
      } else {
        // Add to the current group
        currentGroup.messages.push(message);
      }
    });

    // Don't forget to add the last group
    if (currentGroup) {
      groups.push(currentGroup);
    }

    setMessageGroups(groups);
  }, [messages, user?.id]);

  const scrollToBottom = useThrottle(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, 100);

  useEffect(() => {
    scrollToBottom();
  }, [messageGroups, scrollToBottom]);
  
  const handleSendMessage = async (text: string, files?: File[]) => {
    if (!id) return;
    
    try {
      if (files && files.length > 0) {
        const fileNames = files.map(f => f.name).join(", ");
        const combinedText = text 
          ? `${text}\n\nAttached files: ${fileNames}` 
          : `Attached files: ${fileNames}`;
        
        await sendMessage(combinedText);
      } else {
        await sendMessage(text);
      }
    } catch (error) {
      console.error("Error sending message with files:", error);
      toast.error("Failed to send message with attachments");
    }
  };

  const isLoading = isRoomLoading || isMessagesLoading;

  return (
    <MainLayout>
      <SmartBarProvider>
        <div className="flex flex-col h-full w-full overflow-hidden max-w-full">
          <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-10 w-full px-3 py-2 md:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="flex-shrink-0"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              {isRoomLoading ? (
                <Skeleton className="h-6 w-36 md:w-48" />
              ) : (
                <>
                  <h1 className="text-base md:text-lg font-semibold truncate">{room?.name}</h1>
                  {room?.projects && (
                    <Link to={`/projects/${room.project_id}`} className="flex-shrink-0">
                      <Badge variant="outline" className="text-xs hover:bg-background/80 cursor-pointer" style={{ 
                        backgroundColor: room.projects.color + "20", 
                        borderColor: room.projects.color 
                      }}>
                        {room.projects.name}
                      </Badge>
                    </Link>
                  )}
                </>
              )}
            </div>
            <Button size="icon" variant="ghost" className="flex-shrink-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <FileDropZone>
            <div className="flex-1 overflow-hidden relative">
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                <ContentContainer className={`py-4 ${isMobile ? 'pb-[128px]' : 'pb-[160px]'}`}>
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
          </FileDropZone>

          <SmartBar 
            onSendMessage={handleSendMessage} 
            isDisabled={isLoading} 
            projectId={room?.project_id || null}
          />
        </div>
      </SmartBarProvider>
    </MainLayout>
  );
}
