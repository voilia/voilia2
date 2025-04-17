
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { SmartBarHeader } from "./components/SmartBarHeader";
import { SmartBarMessages } from "./components/SmartBarMessages";
import { FileDropZone } from "./file-upload/FileDropZone";
import { SmartBarInput } from "./SmartBarInput";
import { SmartBarActions } from "./buttons/SmartBarActions";
import { SmartBarFooter } from "./SmartBarFooter";
import { useSmartBar } from "./context/SmartBarContext";
import { toast } from "sonner";
import { RoomMessage } from "@/hooks/useRoomMessages";
import { useIsMobile } from "@/hooks/use-mobile";
import { useThrottle } from "./buttons/mode-selector/hooks/useThrottle";

interface SmartBarProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
  projectId?: string | null;
  addLocalMessage?: (message: RoomMessage) => void;
  room?: {
    name?: string;
    project_id?: string;
    projects?: {
      name: string;
      color: string;
    };
  };
  isLoading: boolean;
}

export function SmartBar({ 
  onSendMessage, 
  isDisabled = false, 
  projectId = null,
  addLocalMessage,
  room,
  isLoading
}: SmartBarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messageGroups, setMessageGroups] = useState<{ userId: string | null; messages: RoomMessage[] }[]>([]);
  const isMobile = useIsMobile();
  const { 
    message, 
    setMessage, 
    mode,
    isSubmitting,
    setIsSubmitting,
    enterSends,
    setEnterSends,
    uploadedFiles,
    clearFiles
  } = useSmartBar();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && uploadedFiles.length === 0) || isDisabled || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      if (uploadedFiles.length > 0) {
        const fileNames = uploadedFiles.map(f => f.name).join(", ");
        const combinedText = message 
          ? `${message}\n\nAttached files: ${fileNames}` 
          : `Attached files: ${fileNames}`;
        
        await onSendMessage(combinedText, uploadedFiles.map(f => f.file));
      } else {
        await onSendMessage(message);
      }
      
      setMessage("");
      clearFiles();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && enterSends) {
      if ((!message.trim() && uploadedFiles.length === 0) || isDisabled || isSubmitting) return;
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full overflow-hidden max-w-full">
        <SmartBarHeader 
          isLoading={isLoading} 
          room={room}
          onBackClick={() => navigate(-1)}
        />

        <FileDropZone>
          <div className="flex-1 overflow-hidden relative">
            <SmartBarMessages
              isLoading={isLoading}
              messageGroups={messageGroups}
              roomName={room?.name}
              scrollAreaRef={scrollAreaRef}
              isMobile={isMobile}
              currentUserId={user?.id}
            />
          </div>
        </FileDropZone>

        <form onSubmit={handleSubmit} className="fixed z-20 w-full px-2 md:px-4 pb-2">
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden border transition-colors duration-200 min-h-[90px] md:min-h-24">
            <SmartBarInput
              value={message}
              onChange={setMessage}
              onKeyDown={handleKeyDown}
              isDisabled={isDisabled}
              isSubmitting={isSubmitting}
            />
            <div className="flex items-center justify-between px-3 py-2">
              <SmartBarActions disabled={isDisabled || isSubmitting} />
            </div>
          </div>
        </form>
        
        <SmartBarFooter 
          enterSends={enterSends}
          onToggleEnterSends={() => setEnterSends(!enterSends)}
          className={isMobile ? "bottom-[86px]" : "bottom-0"}
        />
      </div>
    </>
  );
}
