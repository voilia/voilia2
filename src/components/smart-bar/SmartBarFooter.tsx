
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
      "fixed bottom-0 left-0 right-0 pt-1 pb-2 px-4 text-xs text-muted-foreground z-10",
      "flex items-center",
      isMobile ? "justify-center" : "justify-between"
    )}>
      {isMobile ? (
        "AI can make mistakes. Verify important information."
      ) : (
        <>
          <span>AI can make mistakes. Verify important information.</span>
          <button 
            type="button"
            className="hover:text-foreground transition-colors duration-200"
            onClick={onToggleEnterSends}
          >
            Enter = {enterSends ? "Send" : "New Line"}
          </button>
        </>
      )}
    </div>
  );
}
