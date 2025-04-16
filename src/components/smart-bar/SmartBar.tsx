
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SmartBarFooter } from "./SmartBarFooter";
import { SmartBarActions } from "./buttons/SmartBarActions";
import { SmartBarInput } from "./SmartBarInput";
import { AnimatedSubmitButton } from "./buttons/submit/AnimatedSubmitButton";
import { SmartBarVoiceButton } from "./buttons/SmartBarVoiceButton";
import { ColoredModeIndicator } from "./buttons/mode-selector/ColoredModeIndicator";
import { cn } from "@/lib/utils";
import { useSmartBar } from "./context/SmartBarContext";
import { useTheme } from "@/components/ThemeProvider";

interface SmartBarProps {
  onSendMessage: (message: string) => Promise<void>;
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
    setEnterSends 
  } = useSmartBar();
  
  const isExpanded = true;
  
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
                disabled={!message.trim() || isDisabled || isSubmitting}
                mode={mode}
              />
            </div>
          </div>
        </form>
      </div>
      
      <SmartBarFooter 
        enterSends={enterSends}
        onToggleEnterSends={() => setEnterSends(!enterSends)}
      />
    </>
  );
}
