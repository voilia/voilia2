
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface SmartBarInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isDisabled: boolean;
  isSubmitting: boolean;
  placeholder?: string;
}

export function SmartBarInput({
  value,
  onChange,
  onKeyDown,
  isDisabled,
  isSubmitting,
  placeholder = "Ask anything or use @ to mention a model…"
}: SmartBarInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = "44px"; // Reset height
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = window.innerHeight * 0.4; // 40% of viewport height
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={isDisabled || isSubmitting}
      className={cn(
        "min-h-[44px] max-h-[40vh] flex-1 resize-none border-0 p-3 pr-24 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200",
        value && "animate-pulse-subtle"
      )}
    />
  );
}
