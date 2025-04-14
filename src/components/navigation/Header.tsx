
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

export function Header({ toggleSidebar, isCollapsed }: HeaderProps) {
  const isMobile = useIsMobile();
  
  // Don't render header on mobile, as controls will be in the sidebar
  if (isMobile) {
    return null;
  }

  return (
    <header className="fixed top-0 right-0 z-40 flex items-center justify-between w-full h-14 px-4 border-b border-border/40 backdrop-blur-md bg-background/80 transition-all duration-300" 
      style={{ 
        width: isCollapsed ? '100%' : 'calc(100% - 240px)',
        marginLeft: isCollapsed ? '0' : '240px'
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
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              UV
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">User profile</span>
        </Button>
      </div>
    </header>
  );
}
