
import { cn } from "@/lib/utils";
import { SidebarContent } from "./components/SidebarContent";
import { MobileSidebarFooter } from "./components/MobileSidebarFooter";
import { SidebarCloseButton } from "./components/SidebarCloseButton";
import { SidebarBackdrop } from "./components/SidebarBackdrop";
import { useSidebarState } from "@/hooks/useSidebarState";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
}

export function Sidebar({ className, isCollapsed = true, toggleSidebar }: SidebarProps) {
  const {
    isMobile,
    sidebarVisible,
    handleToggleSidebar,
    handleNavItemClick
  } = useSidebarState(isCollapsed, toggleSidebar);

  return (
    <>
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
          <SidebarCloseButton onClick={handleToggleSidebar} />
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

      {isMobile && (
        <SidebarBackdrop 
          visible={sidebarVisible} 
          onClick={handleToggleSidebar}
        />
      )}
    </>
  );
}
