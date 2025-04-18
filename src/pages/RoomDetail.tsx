
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
import { submitSmartBarMessage, addAiResponseToRoom } from "@/services/n8nService";
import { SmartBarMode } from "@/components/smart-bar/types/smart-bar-types";

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: room, isLoading: isRoomLoading } = useRoom(id);
  const { messages, isLoading: isMessagesLoading, sendMessage, addLocalMessage } = useRoomMessages(id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messageGroups, setMessageGroups] = useState<{ userId: string | null; messages: RoomMessage[] }[]>([]);
  const isMobile = useIsMobile();
  const [isProcessing, setIsProcessing] = useState(false);
  
  useMobileScroll();
  
  // Group messages by sender with consistent ownership determination
  useEffect(() => {
    if (!messages?.length) {
      setMessageGroups([]);
      return;
    }

    const groups: { userId: string | null; messages: RoomMessage[] }[] = [];
    let currentGroup: { userId: string | null; messages: RoomMessage[] } | null = null;

    messages.forEach((message) => {
      // Determine message ownership consistently
      // Agent messages (messageType='agent' or agent_id is set) should be on the left
      // User messages (messageType='user' or user_id matches current user) should be on the right
      const isFromCurrentUser = 
        (message.messageType === 'user') || 
        (message.user_id === user?.id && message.user_id !== null);
      
      const senderId = isFromCurrentUser ? user?.id : message.agent_id || null;
      
      // Start a new group if:
      // 1. This is the first message
      // 2. The sender ID is different from the current group's ID
      // 3. The message type is different (user vs agent)
      if (!currentGroup || 
          currentGroup.userId !== senderId || 
          (isFromCurrentUser !== (currentGroup.messages[0].user_id === user?.id))) {
        // Push the current group if it exists
        if (currentGroup) {
          groups.push(currentGroup);
        }
        
        // Create a new group
        currentGroup = { 
          userId: senderId, 
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

  // Scroll to bottom on new messages
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
  
  // Handle webhook response and add AI message to the room
  const handleWebhookResponse = async (response: any, transactionId: string) => {
    console.log("Received webhook response:", response);
    
    if (!id) return;
    
    try {
      // Check if the response has a message field
      if (response.message) {
        // Get a valid agent ID if available
        const agentId = response.agent_id && 
          typeof response.agent_id === 'string' && 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(response.agent_id) 
            ? response.agent_id 
            : null;
        
        // First add message to local state for immediate display
        const optimisticAiMessage: RoomMessage = {
          id: `temp-${Date.now()}`,
          room_id: id,
          user_id: null,
          agent_id: agentId,
          message_text: response.message,
          created_at: new Date().toISOString(),
          updated_at: null,
          messageType: 'agent',
          transaction_id: transactionId
        };
        
        // Add to local state first for immediate display
        addLocalMessage(optimisticAiMessage);
        
        // Then add to database (which will eventually replace our optimistic message via subscription)
        await addAiResponseToRoom(
          id, 
          agentId, 
          response.message,
          transactionId
        );
      } else if (response.error) {
        throw new Error(response.error);
      } else {
        console.warn("Received response without message content:", response);
      }
    } catch (error) {
      console.error("Error processing webhook response:", error);
      toast.error("Failed to process AI response");
    }
  };
  
  const handleSendMessage = async (text: string, files?: File[]) => {
    if (!id || !text.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // If files are present, include them in the message
      let finalText = text;
      if (files && files.length > 0) {
        const fileNames = files.map(f => f.name).join(", ");
        finalText = `${text}\n\nAttached files: ${fileNames}`;
      }
      
      // Process via n8n webhook
      const result = await submitSmartBarMessage({
        message: finalText,
        roomId: id,
        projectId: room?.project_id || null,
        mode: 'chat' as SmartBarMode,
        uploadedFiles: files?.map(file => ({
          id: `file-${Date.now()}`,
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          preview: URL.createObjectURL(file)
        })) || [],
        onResponseReceived: handleWebhookResponse
      });
      
      if (!result.success && result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = isRoomLoading || isMessagesLoading || isProcessing;

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
                  {isLoading && messages.length === 0 ? (
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
            addLocalMessage={addLocalMessage}
            room={room}
            isLoading={isLoading}
          />
        </div>
      </SmartBarProvider>
    </MainLayout>
  );
}
