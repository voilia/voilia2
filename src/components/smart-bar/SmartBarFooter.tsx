
import { useIsMobile } from "@/hooks/use-mobile";

interface SmartBarFooterProps {
  enterSends: boolean;
  onToggleEnterSends: () => void;
}

export function SmartBarFooter({ enterSends, onToggleEnterSends }: SmartBarFooterProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center text-xs text-muted-foreground py-1 px-4 md:px-6 lg:px-8">
      <div className="flex-1">
        AI can make mistakes. Verify important information.
      </div>
      {!isMobile && (
        <button 
          type="button"
          className="hover:text-foreground text-right"
          onClick={onToggleEnterSends}
        >
          Enter = {enterSends ? "Send" : "New Line"}
        </button>
      )}
    </div>
  );
}
