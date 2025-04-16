
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SmartBarFooterProps {
  enterSends: boolean;
  onToggleEnterSends: () => void;
}

export function SmartBarFooter({ enterSends, onToggleEnterSends }: SmartBarFooterProps) {
  return (
    <div className="flex justify-between items-center text-xs text-muted-foreground px-4 py-1.5 mt-1">
      <div>
        AI can make mistakes. Verify important information.
      </div>
    </div>
  );
}
