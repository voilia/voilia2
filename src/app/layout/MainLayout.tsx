
import { ReactNode, useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/app/navigation/Sidebar";
import { Header } from "@/app/navigation/Header";
import { MobileHeader } from "@/app/navigation/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  // Determine if we're on a room page
  const isRoomPage = location.pathname.includes('/rooms/') && location.pathname.split('/').length > 2;
  
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);
  
  // Auto-collapse sidebar on mobile when entering a room page
  useEffect(() => {
    if (isMobile && isRoomPage) {
      setIsCollapsed(true);
    }
  }, [isMobile, isRoomPage, location.pathname]);
  
  // Calculate sidebar width based on device and collapsed state
  const sidebarWidth = isMobile 
    ? "0px" 
    : (isCollapsed ? "0px" : "240px");
  
  return (
    <div 
      className="min-h-screen flex bg-background text-foreground overflow-hidden"
      style={{ 
        "--sidebar-width": sidebarWidth
      } as React.CSSProperties}
    >
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      {!isMobile && (
        <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      )}
      
      {isMobile && (
        <MobileHeader 
          onToggleSidebar={toggleSidebar} 
          isSidebarOpen={!isCollapsed}
        />
      )}
      
      <main 
        className={cn(
          "flex-1 transition-all duration-200 ease-out relative",
          isRoomPage && isMobile ? "overflow-hidden h-screen w-screen" : "overflow-x-hidden"
        )}
        style={{ 
          marginLeft: isMobile ? '0' : (isCollapsed ? '0' : '240px'),
          paddingTop: isMobile ? '56px' : '2rem',
          width: isMobile ? '100%' : `calc(100% - ${isCollapsed ? '0px' : '240px'})`
        }}
      >
        <div className={cn(
          "mx-auto", 
          isRoomPage ? "h-full px-0 py-0" : "px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6 max-w-[1400px]"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}
