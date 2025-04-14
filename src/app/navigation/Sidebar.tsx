
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarContent } from "./components/SidebarContent";
import { MobileSidebarFooter } from "./components/MobileSidebarFooter";
import { MobileSidebarToggle } from "./components/MobileSidebarToggle";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
}

export function Sidebar({ className, isCollapsed = true, toggleSidebar }: SidebarProps) {
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else if (toggleSidebar) {
      toggleSidebar();
    }
  };
  
  const handleNavItemClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border backdrop-blur-md bg-sidebar/90",
        isCollapsed && !isMobile ? "w-0 opacity-0 overflow-hidden" : "w-[240px]",
        isMobile ? (isMobileSidebarOpen ? "left-0" : "-left-full") : "left-0",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      <SidebarContent 
        isCollapsed={false} 
        onNavItemClick={handleNavItemClick}
      />
      
      {/* Footer for mobile - contains theme toggle and profile */}
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
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
}
