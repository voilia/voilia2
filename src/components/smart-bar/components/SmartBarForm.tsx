
import { useState, useRef } from "react";
import { SmartBarInput } from "../SmartBarInput";
import { SmartBarButton } from "../SmartBarButton";
import { useSmartBar } from "../context/SmartBarContext";
import { Send } from "lucide-react";
import { SmartBarFileButton } from "../buttons/SmartBarFileButton";
import { SmartBarVoiceButton } from "../buttons/SmartBarVoiceButton";
import { toast } from "sonner";
import { SmartBarModeSelector } from "../SmartBarModeSelector";
import { cn } from "@/lib/utils";

export function SmartBarForm({
  onSendMessage,
  isDisabled = false,
}: {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
}) {
  const { message, setMessage, isSubmitting, setIsSubmitting, enterSends, uploadedFiles, clearFiles } = useSmartBar();
  const { mode } = useSmartBar();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!message.trim() && uploadedFiles.length === 0) {
      toast.warning("Please enter a message or attach a file");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSendMessage(message, uploadedFiles.map(file => file.file));
      setMessage("");
      clearFiles();
      if (inputRef.current) {
        inputRef.current.style.height = 'inherit'; // Reset the height
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={cn(
        "flex items-center gap-2 py-3 px-2",
        "backdrop-blur-sm transition-all duration-300"
      )}>
        <div className="flex items-center gap-2 ml-1">
          <SmartBarModeSelector />
          <SmartBarFileButton disabled={isDisabled} />
          <SmartBarVoiceButton disabled={isDisabled} />
        </div>
        
        <SmartBarInput
          value={message}
          onChange={(value) => setMessage(value)}
          onKeyDown={(e) => {
            if (enterSends && e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          isDisabled={isDisabled || isSubmitting}
          id="smart-bar-input"
          name="message-input"
        />
        
        <SmartBarButton
          type="submit"
          icon={Send}
          tooltip="Send"
          disabled={isDisabled || isSubmitting}
          className={cn(
            "hover:shadow-sm transition-all",
            (message.trim() || uploadedFiles.length > 0) ? "opacity-100" : "opacity-70"
          )}
        />
      </div>
    </form>
  );
}
