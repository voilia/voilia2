
import { FormEvent, KeyboardEvent, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageSquare, User, Paperclip, Mic } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SmartBarProps {
  onSendMessage: (message: string) => Promise<void>;
  isDisabled?: boolean;
  placeholder?: string;
}

export function SmartBar({ 
  onSendMessage, 
  isDisabled = false,
  placeholder = "Ask anything or use @ to mention a model…" 
}: SmartBarProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enterSends, setEnterSends] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    textarea.addEventListener("input", adjustHeight);
    adjustHeight();

    return () => {
      textarea.removeEventListener("input", adjustHeight);
    };
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting || isDisabled) return;

    try {
      setIsSubmitting(true);
      await onSendMessage(message);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && enterSends) {
      if (!message.trim() || isSubmitting || isDisabled) return;
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const toggleEnterSends = () => {
    setEnterSends(!enterSends);
  };

  const getButtonStyle = () => {
    if (!message.trim() || isDisabled || isSubmitting) {
      return "bg-primary/50 hover:bg-primary/60 cursor-not-allowed";
    }
    return "bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-sm";
  };

  return (
    <div className="w-full border-t border-border bg-background/80 backdrop-blur-sm transition-all">
      <form onSubmit={handleSubmit} className="container max-w-5xl mx-auto">
        <div className="p-3 relative">
          {/* Top controls row */}
          <div className="flex items-center mb-2 px-2">
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Chat Mode</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
                      <User className="h-4 w-4" />
                      <span className="sr-only">Agent</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Agent</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
                      <Paperclip className="h-4 w-4" />
                      <span className="sr-only">File</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>File</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Input area */}
          <div className="relative flex rounded-lg border border-input bg-background">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isDisabled || isSubmitting}
              className={cn(
                "min-h-[44px] max-h-[200px] flex-1 resize-none border-0 p-3 pr-14 focus-visible:ring-0 focus-visible:ring-offset-0",
                message && "animate-pulse-subtle"
              )}
            />
            
            {/* Voice button (visible on mobile) */}
            <div className="absolute right-14 bottom-2 md:hidden">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">Voice Input</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Voice Input</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Desktop controls - voice input and send button */}
            <div className="absolute right-3 bottom-2 flex items-center">
              {/* Voice button (hidden on mobile) */}
              <div className="hidden md:block mr-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
                        <Mic className="h-4 w-4" />
                        <span className="sr-only">Voice Input</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voice Input</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Send button */}
              <Button 
                type="submit" 
                size="icon"
                disabled={!message.trim() || isDisabled || isSubmitting}
                className={cn("rounded-full h-8 w-8 transition-all", getButtonStyle())}
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4 text-primary-foreground" />
              </Button>
            </div>
          </div>

          {/* Bottom row with disclaimer and enter behavior */}
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 px-2">
            <div>
              AI can make mistakes. Verify important information.
            </div>
            <div className="hidden md:flex items-center">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={toggleEnterSends}
              >
                Enter = {enterSends ? "Send" : "New Line"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
