
import { cn } from "@/lib/utils";

interface ThinkingIndicatorProps {
  className?: string;
  align?: 'left' | 'right';
}

export function ThinkingIndicator({ className, align = 'left' }: ThinkingIndicatorProps) {
  return (
    <div className="group w-full">
      <div className={cn(
        "px-4 py-2 text-sm rounded-xl break-words",
        align === 'right'
          ? "bg-primary/10 text-foreground ml-auto rounded-tr-none"
          : "bg-muted text-foreground mr-auto rounded-tl-none",
        "opacity-80"
      )}>
        <div className={cn(
          "thinking-indicator",
          className
        )}>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
}
