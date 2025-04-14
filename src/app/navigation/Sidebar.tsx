
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarContent } from "./components/SidebarContent";
import { MobileSidebarFooter } from "./components/MobileSidebarFooter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
}

export function Sidebar({ className, isCollapsed = true, toggleSidebar }: SidebarProps) {
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Update local state when isCollapsed prop changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isCollapsed);
    }
  }, [isCollapsed, isMobile]);
  
  // Simple function to handle toggling for both mobile and desktop
  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    }
    
    if (toggleSidebar) {
      toggleSidebar();
    }
  }, [isMobile, isMobileSidebarOpen, toggleSidebar]);
  
  const handleNavItemClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
      if (toggleSidebar) toggleSidebar();
    }
  };

  // On mobile, we use isMobileSidebarOpen to determine visibility
  // On desktop, we use isCollapsed (passed from parent)
  const sidebarVisible = isMobile ? isMobileSidebarOpen : !isCollapsed;

  const sidebarContent = (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border backdrop-blur-md bg-sidebar/90",
        sidebarVisible ? "w-[240px]" : "w-0 opacity-0 overflow-hidden",
        isMobile ? (sidebarVisible ? "left-0" : "-left-full") : "left-0",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      {isMobile && sidebarVisible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95 z-50 md:hidden"
          onClick={handleToggleSidebar}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      )}
      <SidebarContent 
        isCollapsed={false} 
        onNavItemClick={handleNavItemClick}
      />
      
      {isMobile && (
        <MobileSidebarFooter 
          isCollapsed={false} 
          onToggleSidebar={handleToggleSidebar}
        />
      )}
    </div>
  );

  return (
    <>
      {sidebarContent}
      {isMobile && sidebarVisible && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setIsMobileSidebarOpen(false);
            if (toggleSidebar) toggleSidebar();
          }}
        />
      )}
    </>
  );
}
