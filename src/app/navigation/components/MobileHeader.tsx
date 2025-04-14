
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { HeaderControls } from "@/app/navigation/HeaderControls";

interface MobileHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

export function MobileHeader({ onToggleSidebar, isSidebarOpen = false }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(isSidebarOpen);
  
  // Update local state when isSidebarOpen prop changes
  useEffect(() => {
    setIsOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggleSidebar();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 border-b border-border/40 backdrop-blur-md bg-background/80 md:hidden">
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
      
      <HeaderControls />
    </header>
  );
}
