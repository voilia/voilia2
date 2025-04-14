
import { useState, useCallback, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function useSidebarState(isCollapsed: boolean, toggleSidebar?: () => void) {
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isCollapsed);
    }
  }, [isCollapsed, isMobile]);
  
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

  const sidebarVisible = isMobile ? isMobileSidebarOpen : !isCollapsed;

  return {
    isMobile,
    sidebarVisible,
    handleToggleSidebar,
    handleNavItemClick
  };
}
