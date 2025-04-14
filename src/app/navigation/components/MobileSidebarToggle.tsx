
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileSidebarToggleProps {
  onClick: () => void;
}

export function MobileSidebarToggle({ onClick }: MobileSidebarToggleProps) {
  return (
    <Button
      variant="ghost" 
      size="icon" 
      onClick={onClick}
      className="fixed top-3 left-1 z-50 rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
