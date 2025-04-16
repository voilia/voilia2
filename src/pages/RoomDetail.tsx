
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

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: room, isLoading: isRoomLoading } = useRoom(id);
  const { messages, isLoading: isMessagesLoading, sendMessage } = useRoomMessages(id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messageGroups, setMessageGroups] = useState<{ userId: string | null; messages: RoomMessage[] }[]>([]);

  // Group messages by user
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

  // Enhanced scroll behavior with throttling
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
      // For now, we'll just send the text message
      // In a real implementation, you would upload the files to a server
      // and include their references in the message
      
      if (files && files.length > 0) {
        // Mock implementation - in a real app, you would:
        // 1. Upload files to a storage service
        // 2. Get back file URLs/IDs
        // 3. Include those in your message data
        const fileNames = files.map(f => f.name).join(", ");
        const combinedText = text 
          ? `${text}\n\nAttached files: ${fileNames}` 
          : `Attached files: ${fileNames}`;
        
        await sendMessage(combinedText);
        
        // Mock notification for files (in a real app, the files would be processed)
        if (files.length === 1) {
          toast.info(`1 file attached to message`);
        } else {
          toast.info(`${files.length} files attached to message`);
        }
      } else {
        // Just send the text message
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
        <div className="flex flex-col h-[calc(100vh-56px)] md:h-screen relative">
          <div className="bg-background/95 backdrop-blur-sm border-b border-border p-3 md:p-4 sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-1"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              {isRoomLoading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <>
                  <h1 className="text-lg font-semibold">{room?.name}</h1>
                  {room?.projects && (
                    <Link to={`/projects/${room.project_id}`}>
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
            <Button size="icon" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <FileDropZone>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                <ContentContainer className="py-4 pb-[160px]">
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

          <SmartBar onSendMessage={handleSendMessage} isDisabled={isLoading} />
        </div>
      </SmartBarProvider>
    </MainLayout>
  );
}
