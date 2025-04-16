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

interface SmartBarProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
}

export function SmartBar({ onSendMessage, isDisabled = false }: SmartBarProps) {
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
      
      // Collect files from uploadedFiles
      const files = uploadedFiles.map(item => item.file);
      
      // Send message with files - we're not showing success toast anymore
      await onSendMessage(message, files);
      
      // Reset state after sending
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
        className="fixed bottom-16 z-20 w-full px-4"
        style={{
          left: isMobile ? 0 : 'var(--sidebar-width, 0px)',
          right: 0,
          maxWidth: '48rem',
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
      />
    </>
  );
}
