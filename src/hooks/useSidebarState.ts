
import { useState, useCallback, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

export function useSidebarState(isCollapsed: boolean, toggleSidebar?: () => void) {
  const isMobile = useIsMobile();
  const location = useLocation();
  // Initialize mobile sidebar to CLOSED by default
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Force sidebar closed on mobile page loads/navigation
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile, location.pathname]); // Add dependency on route changes
  
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
