
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SmartBarFooterProps {
  enterSends: boolean;
  onToggleEnterSends: () => void;
}

export function SmartBarFooter({ enterSends, onToggleEnterSends }: SmartBarFooterProps) {
  const isMobile = useIsMobile();

  return (
    <div className="fixed bottom-0 z-10 w-full" style={{
      left: isMobile ? 0 : 'var(--sidebar-width, 0px)',
      right: 0,
      maxWidth: 'calc(900px + 2rem)',
      margin: '0 auto',
    }}>
      <div className="px-4 pt-1 pb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>AI can make mistakes. Verify important information.</span>
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
    </div>
  );
}
