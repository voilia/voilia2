
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
    <div className="relative mb-4">
      <form onSubmit={handleSubmit}>
        <div className="relative rounded-xl border border-input bg-background/70 backdrop-blur-md shadow-sm overflow-hidden group hover:border-primary/50 hover:shadow-md transition-all duration-200">
          <div className="relative flex items-end">
            {/* Action buttons on the left */}
            <div className="px-3 py-3 flex items-center">
              <SmartBarActions />
            </div>
            
            {/* Input area */}
            <div className="flex-1 pr-[84px]">
              <SmartBarInput
                value={message}
                onChange={setMessage}
                onKeyDown={handleKeyDown}
                isDisabled={isDisabled}
                isSubmitting={isSubmitting}
              />
            </div>
            
            {/* Voice button and submit button */}
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <SmartBarVoiceButton 
                className={cn(
                  "transition-opacity duration-200",
                  isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              />
              <SmartBarSubmitButton 
                disabled={!message.trim() || isDisabled || isSubmitting}
              />
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
