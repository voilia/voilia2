
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { HeaderControls } from "./HeaderControls";

interface HeaderProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

export function Header({ toggleSidebar, isCollapsed }: HeaderProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isCollapsed);
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
    toggleSidebar();
  };
  
  // Don't render header on mobile
  if (isMobile) {
    return null;
  }

  return (
    <header className="fixed top-0 right-0 z-40 flex items-center justify-between w-full h-14 px-4 border-b border-border/40 backdrop-blur-md bg-background/80 transition-all duration-300" 
      style={{ 
        width: !isCollapsed ? 'calc(100% - 240px)' : '100%',
        marginLeft: !isCollapsed ? '240px' : '0'
      }}>
      <div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleToggle}
          className="rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
        >
          <div className="relative w-5 h-5">
            <Menu className={`absolute h-5 w-5 transition-all duration-300 ${
              isOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
            }`} />
            <X className={`absolute h-5 w-5 transition-all duration-300 ${
              isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
            }`} />
          </div>
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      
      <HeaderControls />
    </header>
  );
}
