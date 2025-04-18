
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SmartBarFooterProps {
  enterSends: boolean;
  onToggleEnterSends: () => void;
  className?: string;
}

export function SmartBarFooter({ enterSends, onToggleEnterSends, className }: SmartBarFooterProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "w-full py-2 px-4 bg-transparent",
      "flex items-center text-xs text-muted-foreground/70",
      "border-t border-slate-200/30 dark:border-slate-700/30",
      isMobile ? "justify-center" : "justify-between",
      className
    )}>
      <span className="text-muted-foreground/60 dark:text-muted-foreground/50">AI can make mistakes. Verify important information.</span>
      {!isMobile && (
        <button 
          type="button"
          className="hover:text-foreground transition-colors duration-200 text-muted-foreground/70"
          onClick={onToggleEnterSends}
        >
          Enter = {enterSends ? "Send" : "New Line"}
        </button>
      )}
    </div>
  );
}
