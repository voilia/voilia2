
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SmartBarFooterProps {
  enterSends: boolean;
  onToggleEnterSends: () => void;
}

export function SmartBarFooter({ enterSends, onToggleEnterSends }: SmartBarFooterProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center text-xs text-muted-foreground px-4 py-1.5 bg-background/80 backdrop-blur-sm">
      <div>
        AI can make mistakes. Verify important information.
      </div>
      {!isMobile && (
        <div className="flex items-center">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs hover:bg-transparent"
            onClick={onToggleEnterSends}
          >
            Enter = {enterSends ? "Send" : "New Line"}
          </Button>
        </div>
      )}
    </div>
  );
}
