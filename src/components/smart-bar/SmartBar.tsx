
import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, User, Paperclip, Mic, ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { SmartBarFooter } from "./SmartBarFooter";
import { SmartBarButton } from "./SmartBarButton";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SmartBarProps {
  onSendMessage: (message: string) => Promise<void>;
  isDisabled?: boolean;
}

export function SmartBar({ onSendMessage, isDisabled = false }: SmartBarProps) {
  const [message, setMessage] = useState("");
  const [enterSends, setEnterSends] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = "44px"; // Reset height
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = window.innerHeight * 0.4; // 40% of viewport height
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isDisabled || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "44px";
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && enterSends) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border">
      <form onSubmit={handleSubmit} className="container max-w-5xl mx-auto">
        <div className="p-3">
          {/* Top controls row */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <SmartBarButton icon={MessageSquare} tooltip="Chat Mode" />
              <SmartBarButton icon={User} tooltip="Select Agent" />
              <SmartBarButton icon={Paperclip} tooltip="Upload File" />
            </div>
          </div>

          {/* Input area */}
          <div className="relative flex rounded-lg border border-input bg-background shadow-sm">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or use @ to mention a model…"
              disabled={isDisabled || isSubmitting}
              className={cn(
                "min-h-[44px] max-h-[40vh] flex-1 resize-none border-0 p-3 pr-24 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200",
                message && "animate-pulse-subtle"
              )}
            />
            
            {/* Voice button and send button */}
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <SmartBarButton 
                icon={Mic} 
                tooltip="Voice Input" 
                className={cn(
                  "transition-opacity duration-200",
                  isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              />
              <button
                type="submit"
                disabled={!message.trim() || isDisabled || isSubmitting}
                className={cn(
                  "rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200",
                  message.trim() 
                    ? "bg-primary hover:bg-primary/90 hover:scale-105 shadow-sm" 
                    : "bg-muted cursor-not-allowed"
                )}
                aria-label="Send message"
              >
                <ArrowUp className={cn(
                  "h-4 w-4",
                  message.trim() ? "text-primary-foreground" : "text-muted-foreground"
                )} />
              </button>
            </div>
          </div>
        </div>
      </form>
      <SmartBarFooter 
        enterSends={enterSends}
        onToggleEnterSends={() => setEnterSends(!enterSends)}
      />
    </div>
  );
}
