
import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, User, Paperclip, Mic, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const maxHeight = window.innerHeight * 0.4;
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
      textareaRef.current?.focus();
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
    <div className="sticky bottom-0 z-10 w-full">
      <div className="relative w-full border-t border-border bg-background/80 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="container max-w-5xl mx-auto">
          <div className="p-3 relative">
            {/* Top controls row */}
            <div className="flex items-center gap-2 mb-2 px-2">
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                <SmartBarButton icon={MessageSquare} tooltip="Mode" />
                <SmartBarButton icon={User} tooltip="Agent" />
                <SmartBarButton icon={Paperclip} tooltip="Attach File" />
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
                  "min-h-[44px] max-h-[40vh] flex-1 resize-none border-0 p-3 pr-24 focus-visible:ring-0 focus-visible:ring-offset-0",
                  message && "animate-pulse-subtle"
                )}
              />
              
              {/* Voice button (mobile) and send button */}
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                {isMobile && (
                  <SmartBarButton icon={Mic} tooltip="Voice Input" variant="ghost" size="sm" />
                )}
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!message.trim() || isDisabled || isSubmitting}
                  className={cn(
                    "rounded-full h-8 w-8 transition-all",
                    message.trim() 
                      ? "bg-primary hover:bg-primary/90 hover:scale-105" 
                      : "bg-primary/50 hover:bg-primary/60 cursor-not-allowed"
                  )}
                  aria-label="Send message"
                >
                  <ArrowUp className="h-4 w-4 text-primary-foreground" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <SmartBarFooter 
        enterSends={enterSends}
        onToggleEnterSends={() => setEnterSends(!enterSends)}
      />
    </div>
  );
}
