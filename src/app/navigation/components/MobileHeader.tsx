
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onToggleSidebar: () => void;
}

export function MobileHeader({ onToggleSidebar }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 border-b border-border/40 backdrop-blur-md bg-background/80 md:hidden">
      <Button
        variant="ghost" 
        size="icon" 
        onClick={onToggleSidebar}
        className="rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      
      <div className="flex items-center">
        {/* Theme toggle is now only shown in mobile sidebar footer */}
      </div>
    </header>
  );
}
