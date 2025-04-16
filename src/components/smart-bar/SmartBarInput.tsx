
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
    
    // Reset height to auto first to get accurate scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height (capped at 40vh)
    const maxHeight = window.innerHeight * 0.4;
    const minHeight = 56; // Minimum height in pixels
    const newHeight = Math.max(Math.min(textarea.scrollHeight, maxHeight), minHeight);
    
    // Apply new height with smooth transition
    textarea.style.height = `${newHeight}px`;
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
        "min-h-[56px] max-h-[40vh] flex-1 resize-none border-0 p-3 pb-2",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "transition-all duration-200",
        value && "animate-pulse-subtle"
      )}
    />
  );
}
