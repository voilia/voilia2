
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useRoom } from "@/hooks/useRoom";
import { MainLayout } from "@/app/layout/MainLayout";
import { SmartBar } from "@/components/smart-bar/SmartBar";
import { SmartBarProvider } from "@/components/smart-bar/context/SmartBarContext";
import { FileDropZone } from "@/components/smart-bar/file-upload/FileDropZone";
import { useThrottle } from "@/components/smart-bar/buttons/mode-selector/hooks/useThrottle";
import { useRoomDetailMessages } from "@/hooks/useRoomDetailMessages";
import { RoomDetailHeader } from "@/components/rooms/detail/RoomDetailHeader";
import { RoomMessagesContainer } from "@/components/rooms/detail/RoomMessagesContainer";

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: room, isLoading: isRoomLoading } = useRoom(id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    messageGroups,
    isLoading: isMessagesLoading,
    handleSendMessage,
    addLocalMessage
  } = useRoomDetailMessages(id, room?.project_id || null);

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

  const isLoading = isRoomLoading || isMessagesLoading;

  return (
    <MainLayout>
      <SmartBarProvider>
        <div className="flex flex-col h-full w-full overflow-hidden max-w-full">
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
                messages={messageGroups}
                roomName={room?.name}
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
