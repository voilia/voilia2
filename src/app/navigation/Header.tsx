
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderControls } from "./HeaderControls";

interface HeaderProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

export function Header({ toggleSidebar, isCollapsed }: HeaderProps) {
  const isMobile = useIsMobile();
  
  // Don't render header on mobile
  if (isMobile) {
    return null;
  }

  return (
    <header className="fixed top-0 right-0 z-40 flex items-center justify-between w-full h-14 px-4 border-b border-border/40 backdrop-blur-md bg-background/80 transition-all duration-300" 
      style={{ 
        width: isCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 240px)',
        marginLeft: isCollapsed ? '70px' : '240px'
      }}>
      <div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      
      <HeaderControls />
    </header>
  );
}
