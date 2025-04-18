
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
      "w-full bg-background/80 backdrop-blur-[2px] py-1",
      "flex items-center",
      isMobile ? "justify-center" : "justify-between px-4",
      className
    )}>
      <span className="text-xs text-muted-foreground">
        AI can make mistakes. Verify important information.
      </span>
      {!isMobile && (
        <button 
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          onClick={onToggleEnterSends}
        >
          Enter = {enterSends ? "Send" : "New Line"}
        </button>
      )}
    </div>
  );
}
