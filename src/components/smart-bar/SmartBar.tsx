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
import { submitSmartBarMessage, addAiResponseToRoom } from "@/services/n8nService";

interface SmartBarProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
  projectId?: string | null;
}

export function SmartBar({ onSendMessage, isDisabled = false, projectId = null }: SmartBarProps) {
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
  const isExpanded = true;
  
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && uploadedFiles.length === 0) || isDisabled || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // First, handle the standard message sending to update the local UI
      // This provides immediate feedback to the user
      const files = uploadedFiles.map(item => item.file);
      await onSendMessage(message, files);
      
      // Then submit to the N8N webhook
      if (roomId) {
        await submitSmartBarMessage({
          message,
          roomId,
          projectId,
          mode,
          uploadedFiles,
          agentIds: [], // You can add agent selection logic here
          onStart: () => {
            // Already handled with setIsSubmitting(true)
          },
          onComplete: () => {
            // UI reset is already handled below
          },
          onError: (error) => {
            console.error("N8N webhook error:", error);
            // Don't show toast here as the message was already sent locally
          },
          onResponseReceived: (responseData) => {
            if (responseData?.data?.response?.text && roomId) {
              // Add AI response to the database so it shows in the chat
              addAiResponseToRoom(
                roomId, 
                responseData.data.agent?.id || null, 
                responseData.data.response.text
              );
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
        className={`fixed z-20 w-full ${isMobile ? 'px-2' : 'px-4'}`}
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
            "relative rounded-2xl overflow-hidden",
            "border transition-colors duration-200",
            isDark ? "border-white/10 bg-black/30" : "border-foreground/10 bg-foreground/5",
            "backdrop-blur-lg shadow-sm",
            "min-h-24"
          )}
        >
          <ColoredModeIndicator mode={mode} />
          
          <div className="w-full pt-1">
            <SmartBarInput
              value={message}
              onChange={setMessage}
              onKeyDown={handleKeyDown}
              isDisabled={isDisabled}
              isSubmitting={isSubmitting}
            />
          </div>
          
          <div className="flex items-center justify-between px-3 py-2">
            <SmartBarActions />
            
            <div className="flex items-center gap-3">
              <SmartBarVoiceButton />
              <AnimatedSubmitButton 
                disabled={!canSubmit}
                mode={mode}
              />
            </div>
          </div>
        </form>
        
        {/* File Upload Popover */}
        <FileUploadPopover />
        
        {/* Voice Recording Popover */}
        <VoiceRecordingPopover />
      </div>
      
      <SmartBarFooter 
        enterSends={enterSends}
        onToggleEnterSends={() => setEnterSends(!enterSends)}
        className={isMobile ? "bottom-16" : "bottom-0"}
      />
    </>
  );
}
