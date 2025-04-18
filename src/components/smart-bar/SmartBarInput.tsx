
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from "@/lib/utils";

interface SmartBarInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isDisabled?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
}

export function SmartBarInput({ 
  value, 
  onChange, 
  onKeyDown, 
  isDisabled = false,
  placeholder = "Ask anything or use @ to mention a model...",
  id = "smart-bar-input",
  name = "message-input"
}: SmartBarInputProps) {
  return (
    <div className="relative flex-1">
      <TextareaAutosize
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={isDisabled}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2",
          "resize-none outline-none border-0",
          "bg-transparent",
          "text-base text-foreground/90",
          "placeholder:text-muted-foreground/50",
          "focus:ring-0",
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
