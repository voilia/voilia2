
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SmartBarFooter } from "./SmartBarFooter";
import { SmartBarActions } from "./buttons/SmartBarActions";
import { SmartBarInput } from "./SmartBarInput";
import { SmartBarSubmitButton } from "./buttons/SmartBarSubmitButton";
import { SmartBarVoiceButton } from "./buttons/SmartBarVoiceButton";
import { cn } from "@/lib/utils";

interface SmartBarProps {
  onSendMessage: (message: string) => Promise<void>;
  isDisabled?: boolean;
}

export function SmartBar({ onSendMessage, isDisabled = false }: SmartBarProps) {
  const [message, setMessage] = useState("");
  const [enterSends, setEnterSends] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isDisabled || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && enterSends) {
      if (!message.trim() || isDisabled || isSubmitting) return;
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        <div className="relative rounded-xl border border-input bg-background/70 backdrop-blur-md shadow-sm overflow-hidden group hover:border-primary/50 hover:shadow-md transition-all duration-200">
          {/* Input area */}
          <div className="w-full">
            <SmartBarInput
              value={message}
              onChange={setMessage}
              onKeyDown={handleKeyDown}
              isDisabled={isDisabled}
              isSubmitting={isSubmitting}
            />
          </div>
          
          {/* Bottom row with actions and submit */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-input/50">
            <SmartBarActions />
            
            <div className="flex items-center gap-2">
              <SmartBarVoiceButton className={cn(
                "transition-opacity duration-200",
                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )} />
              <div className="flex flex-col items-end">
                <SmartBarSubmitButton 
                  disabled={!message.trim() || isDisabled || isSubmitting}
                />
                {!isMobile && (
                  <button 
                    type="button" 
                    className="text-xs text-muted-foreground hover:text-foreground mt-1"
                    onClick={() => setEnterSends(!enterSends)}
                  >
                    Enter = {enterSends ? "Send" : "New Line"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      
      <SmartBarFooter />
    </div>
  );
}
