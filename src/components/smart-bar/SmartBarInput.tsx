import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSmartBar } from "./context/SmartBarContext";
import TextareaAutosize from 'react-textarea-autosize';

interface SmartBarInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isDisabled?: boolean;
  isSubmitting?: boolean;
  id?: string;
  name?: string;
}

export function SmartBarInput({ 
  value, 
  onChange, 
  onKeyDown, 
  isDisabled = false,
  isSubmitting = false,
  id = "smart-bar-input",
  name = "message-input"
}: SmartBarInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { uploadedFiles } = useSmartBar();
  
  // Auto-focus the input when the component mounts
  useEffect(() => {
    if (textareaRef.current && !isDisabled && !isSubmitting) {
      textareaRef.current.focus();
    }
  }, [isDisabled, isSubmitting]);

  return (
    <div className="relative w-full">
      <TextareaAutosize
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={isDisabled || isSubmitting}
        placeholder="Ask anything or use @ to mention a model..."
        className={cn(
          "w-full px-4 py-4 bg-transparent",
          "resize-none outline-none border-0",
          "text-base text-foreground/90",
          "placeholder:text-muted-foreground/70",
          "disabled:opacity-50"
        )}
        maxRows={8}
        id={id}
        name={name}
        aria-label="Message input"
      />
    </div>
  );
}
