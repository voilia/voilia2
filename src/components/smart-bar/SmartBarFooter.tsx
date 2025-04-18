
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
    <div className={cn("w-full text-center bg-background/80 backdrop-blur-[2px] py-1", className)}>
      <div className="px-2 md:px-4 flex items-center justify-center text-xs text-muted-foreground">
        <span>AI can make mistakes. Verify important information.</span>
        {!isMobile && (
          <button 
            type="button"
            className="hover:text-foreground transition-colors duration-200 ml-2"
            onClick={onToggleEnterSends}
          >
            Enter = {enterSends ? "Send" : "New Line"}
          </button>
        )}
      </div>
    </div>
  );
}
