
import { useIsMobile } from "@/hooks/use-mobile";

interface SmartBarFooterProps {
  enterSends: boolean;
  onToggleEnterSends: () => void;
}

export function SmartBarFooter({ enterSends, onToggleEnterSends }: SmartBarFooterProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center text-xs text-muted-foreground py-1">
      <div>
        AI can make mistakes. Verify important information.
      </div>
      {!isMobile && (
        <button 
          type="button"
          className="hover:text-foreground"
          onClick={onToggleEnterSends}
        >
          Enter = {enterSends ? "Send" : "New Line"}
        </button>
      )}
    </div>
  );
}
