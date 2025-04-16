import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SmartBarFooter } from "./SmartBarFooter";
import { SmartBarActions } from "./buttons/SmartBarActions";
import { SmartBarInput } from "./SmartBarInput";
import { SmartBarSubmitButton } from "./buttons/SmartBarSubmitButton";
import { SmartBarVoiceButton } from "./buttons/SmartBarVoiceButton";
import { SmartBarModeSelector, SmartBarMode } from "./SmartBarModeSelector";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

interface SmartBarProps {
  onSendMessage: (message: string) => Promise<void>;
  isDisabled?: boolean;
}

export function SmartBar({ onSendMessage, isDisabled = false }: SmartBarProps) {
  const [message, setMessage] = useState("");
  const [enterSends, setEnterSends] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<SmartBarMode>("chat");
  const [isExpanded, setIsExpanded] = useState(false);
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

  useEffect(() => {
    setIsExpanded(message.length > 0);
  }, [message]);

  return (
    <>
      <div 
        className="fixed bottom-14 z-20 w-full px-4"
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
            "border transition-all duration-300",
            isDark ? "border-white/10 bg-black/30" : "border-foreground/10 bg-foreground/5",
            "backdrop-blur-lg shadow-sm",
            isExpanded ? "min-h-24" : "h-14"
          )}
        >
          {/* Colored mode indicator line */}
          <div 
            className={cn(
              "absolute top-0 left-0 right-0 h-1 transition-colors duration-300",
              mode === "chat" && (isDark ? "bg-[#9333EA]" : "bg-[#8B5CF6]"),
              mode === "visual" && (isDark ? "bg-[#FB923C]" : "bg-[#F97316]"),
              mode === "assist" && (isDark ? "bg-[#60A5FA]" : "bg-[#3B82F6]"),
              mode === "vault" && (isDark ? "bg-[#34D399]" : "bg-[#10B981]")
            )}
            aria-hidden="true"
          />
          
          {/* Input area */}
          <div className="w-full pt-1">
            <SmartBarInput
              value={message}
              onChange={setMessage}
              onKeyDown={handleKeyDown}
              isDisabled={isDisabled}
              isSubmitting={isSubmitting}
            />
          </div>
          
          {/* Bottom row with actions and submit */}
          <div className="flex items-center justify-between px-3 py-2">
            <SmartBarActions 
              selectedMode={mode} 
              onModeChange={setMode} 
            />
            
            <div className="flex items-center gap-2">
              <SmartBarVoiceButton />
              <SmartBarSubmitButton 
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
