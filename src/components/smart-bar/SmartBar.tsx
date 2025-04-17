
import { useEffect, useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SmartBarFooter } from "./SmartBarFooter";
import { SmartBarActions } from "./buttons/SmartBarActions";
import { SmartBarInput } from "./SmartBarInput";
import { AnimatedSubmitButton } from "./buttons/submit/AnimatedSubmitButton";
import { SmartBarVoiceButton } from "./buttons/SmartBarVoiceButton";
import { ColoredModeIndicator } from "./buttons/mode-selector/ColoredModeIndicator";
import { FileUploadPopover } from "./file-upload/FileUploadPopover";
import { VoiceRecordingPopover } from "./voice-input/VoiceRecordingPopover";
import { cn } from "@/lib/utils";
import { useSmartBar } from "./context/SmartBarContext";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { RoomMessage } from "@/hooks/useRoomMessages";
import { submitSmartBarMessage, addAiResponseToRoom } from "@/services/n8nService";
import { v4 as uuidv4 } from 'uuid';

interface SmartBarProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
  projectId?: string | null;
  addLocalMessage?: (message: RoomMessage) => void; // New prop for adding local messages
}

export function SmartBar({ 
  onSendMessage, 
  isDisabled = false, 
  projectId = null,
  addLocalMessage
}: SmartBarProps) {
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
  
  const { id: roomId } = useParams<{ id: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Track if we're waiting for an AI response
  const [waitingForAiResponse, setWaitingForAiResponse] = useState(false);
  const pendingMessageRef = useRef<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && uploadedFiles.length === 0) || isDisabled || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // Track that we're starting a new message exchange
      const currentMessageText = message;
      pendingMessageRef.current = currentMessageText;
      setWaitingForAiResponse(true);
      
      // First, handle the standard message sending to update the local UI
      const files = uploadedFiles.map(item => item.file);
      await onSendMessage(message, files);
      
      // Then submit to the N8N webhook
      if (roomId) {
        await submitSmartBarMessage({
          message: currentMessageText,
          roomId,
          projectId,
          mode,
          uploadedFiles,
          agentIds: [], // You can add agent selection logic here
          onStart: () => {
            // Already handled with setIsSubmitting(true)
          },
          onComplete: () => {
            // Allow 500ms buffer to receive the response before resetting state
            setTimeout(() => {
              // Only reset waiting state if this is still the same pending message
              if (pendingMessageRef.current === currentMessageText) {
                setWaitingForAiResponse(false);
                pendingMessageRef.current = null;
              }
            }, 500);
          },
          onError: (error) => {
            console.error("N8N webhook error:", error);
            setWaitingForAiResponse(false);
            pendingMessageRef.current = null;
            // Don't show toast here as the message was already sent locally
          },
          onResponseReceived: (responseData) => {
            try {
              if (responseData?.data?.response?.text && roomId && addLocalMessage) {
                // Extract agent ID or use a fallback
                const agentId = responseData.data.agent?.id || null;
                
                // Make sure the agentId is a valid UUID if provided
                const validAgentId = agentId && typeof agentId === 'string' && 
                  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(agentId) 
                  ? agentId : null;
                
                // Create a temporary message to display immediately
                const aiMessage: RoomMessage = {
                  id: uuidv4(), // Temporary ID that will be replaced
                  room_id: roomId,
                  user_id: null, // AI messages have null user_id
                  agent_id: validAgentId,
                  message_text: responseData.data.response.text,
                  created_at: new Date().toISOString(),
                  updated_at: null,
                  isPending: true // Mark as pending so it can be replaced
                };
                
                // Add the AI message to the UI immediately
                addLocalMessage(aiMessage);
                
                // Then save it to the database
                addAiResponseToRoom(
                  roomId, 
                  validAgentId, 
                  responseData.data.response.text
                ).catch(err => {
                  console.error("Failed to add AI response to room:", err);
                });
                
                // Mark that we've received a response
                if (pendingMessageRef.current === currentMessageText) {
                  setWaitingForAiResponse(false);
                  pendingMessageRef.current = null;
                }
              } else {
                console.warn("Received empty or invalid response from N8N webhook", responseData);
                setWaitingForAiResponse(false);
              }
            } catch (err) {
              console.error("Error processing N8N response:", err);
              setWaitingForAiResponse(false);
              pendingMessageRef.current = null;
            }
          }
        });
      }
      
      // Reset UI state
      setMessage("");
      clearFiles();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setWaitingForAiResponse(false);
      pendingMessageRef.current = null;
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

  // Allow submission even if text is empty but files are attached
  const canSubmit = (message.trim().length > 0 || uploadedFiles.length > 0) && !isDisabled && !isSubmitting;

  return (
    <>
      <div 
        className={cn(
          "fixed z-20 w-full",
          isMobile ? 'px-2 pb-2' : 'px-4',
          "transition-all duration-150"
        )}
        style={{
          left: isMobile ? 0 : 'var(--sidebar-width, 0px)',
          right: 0,
          bottom: isMobile ? 0 : '4rem',
          maxWidth: isMobile ? '100%' : '48rem',
          margin: '0 auto',
        }}
      >
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className={cn(
            "relative rounded-xl md:rounded-2xl overflow-hidden",
            "border transition-colors duration-200",
            isDark ? "border-white/10 bg-black/30" : "border-foreground/10 bg-foreground/5",
            "backdrop-blur-lg shadow-sm",
            "min-h-[90px] md:min-h-24",
            waitingForAiResponse && "opacity-80"
          )}
          aria-label="Message input form"
        >
          <ColoredModeIndicator mode={mode} />
          
          <div className="w-full pt-1">
            <SmartBarInput
              value={message}
              onChange={setMessage}
              onKeyDown={handleKeyDown}
              isDisabled={isDisabled || waitingForAiResponse}
              isSubmitting={isSubmitting}
              id="message-input"
              name="message"
            />
          </div>
          
          <div className="flex items-center justify-between px-3 py-2">
            <SmartBarActions disabled={waitingForAiResponse} />
            
            <div className="flex items-center gap-2 md:gap-3">
              <SmartBarVoiceButton disabled={waitingForAiResponse} />
              <AnimatedSubmitButton 
                disabled={!canSubmit || waitingForAiResponse}
                mode={mode}
                aria-label="Send message"
              />
            </div>
          </div>
        </form>
        
        {/* File Upload Popover with mobile optimizations */}
        <FileUploadPopover />
        
        {/* Voice Recording Popover with mobile optimizations */}
        <VoiceRecordingPopover />
      </div>
      
      <SmartBarFooter 
        enterSends={enterSends}
        onToggleEnterSends={() => setEnterSends(!enterSends)}
        className={isMobile ? "bottom-[86px]" : "bottom-0"}
      />
    </>
  );
}
