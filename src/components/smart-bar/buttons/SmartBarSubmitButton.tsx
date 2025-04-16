
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartBarSubmitButtonProps {
  disabled: boolean;
}

export function SmartBarSubmitButton({ disabled }: SmartBarSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200",
        disabled
          ? "bg-muted cursor-not-allowed"
          : "bg-primary hover:bg-primary/90 hover:scale-105 shadow-sm"
      )}
      aria-label="Send message"
    >
      <ArrowUp className={cn(
        "h-4 w-4",
        disabled ? "text-muted-foreground" : "text-primary-foreground"
      )} />
    </button>
  );
}
