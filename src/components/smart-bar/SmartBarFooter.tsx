
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SmartBarFooterProps {
  enterSends: boolean;
  onToggleEnterSends: () => void;
}

export function SmartBarFooter({ enterSends, onToggleEnterSends }: SmartBarFooterProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex items-center py-1 px-4 text-xs text-muted-foreground",
      isMobile ? "justify-center" : "justify-between"
    )}>
      <div className={cn(
        "flex-1",
        isMobile && "text-center"
      )}>
        AI can make mistakes. Verify important information.
      </div>
      {!isMobile && (
        <button 
          type="button"
          className="hover:text-foreground transition-colors duration-200"
          onClick={onToggleEnterSends}
        >
          Enter = {enterSends ? "Send" : "New Line"}
        </button>
      )}
    </div>
  );
}
