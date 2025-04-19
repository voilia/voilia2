
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface SmartBarFooterProps {
  enterSends: boolean;
  onToggleEnterSends: () => void;
  className?: string;
}

export function SmartBarFooter({ enterSends, onToggleEnterSends, className }: SmartBarFooterProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isDemoRoom = location.pathname === "/rooms/demoroom1";
  
  // Don't show verification text on mobile in demo room
  const showVerificationText = !(isDemoRoom && isMobile);

  return (
    <div className={cn(
      "w-full py-2 px-4",
      "flex items-center text-xs",
      "bg-white/80 dark:bg-background/80 backdrop-blur-sm",
      "border border-white/20 dark:border-slate-700/30 rounded-xl",
      "shadow-sm",
      isMobile ? "justify-center" : "justify-between",
      className
    )}>
      {showVerificationText && (
        <span className="text-muted-foreground/60 dark:text-muted-foreground/50">
          AI can make mistakes. Verify important information.
        </span>
      )}
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
