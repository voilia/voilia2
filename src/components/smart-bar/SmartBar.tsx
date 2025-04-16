
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border">
      <form onSubmit={handleSubmit} className="container max-w-5xl mx-auto">
        <div className="p-3">
          <div className="relative rounded-xl border border-input bg-background/70 backdrop-blur-md shadow-sm overflow-hidden group hover:border-primary/50 transition-all duration-200">
            {/* Top actions row inside the input container */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
              <SmartBarActions />
            </div>
            
            {/* Input area */}
            <div className="relative flex">
              <SmartBarInput
                value={message}
                onChange={setMessage}
                onKeyDown={handleKeyDown}
                isDisabled={isDisabled}
                isSubmitting={isSubmitting}
              />
              
              {/* Voice button and send button */}
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
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
        </div>
      </form>
      <SmartBarFooter 
        enterSends={enterSends}
        onToggleEnterSends={() => setEnterSends(!enterSends)}
      />
    </div>
  );
}
