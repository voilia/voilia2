
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileSidebarToggleProps {
  onClick: () => void;
}

export function MobileSidebarToggle({ onClick }: MobileSidebarToggleProps) {
  // This component is kept for backward compatibility but is no longer used directly
  // The mobile header now contains the hamburger menu
  return (
    <Button
      variant="ghost" 
      size="icon" 
      onClick={onClick}
      className="h-9 w-9 rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95 md:hidden"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
