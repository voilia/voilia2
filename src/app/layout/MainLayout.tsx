import { ReactNode, useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/app/navigation/Sidebar";
import { Header } from "@/app/navigation/Header";
import { MobileHeader } from "@/app/navigation/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

export function MainLayout({ children, hideSidebar = false }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(hideSidebar);
  const location = useLocation();
  
  // Determine if we're on a room page
  const isRoomPage = location.pathname.includes('/rooms/') && location.pathname.split('/').length > 2;
  
  const toggleSidebar = useCallback(() => {
    if (!hideSidebar) {
      setIsCollapsed(!isCollapsed);
    }
  }, [isCollapsed, hideSidebar]);
  
  // Auto-collapse sidebar on mobile when entering a room page
  useEffect(() => {
    if (isMobile && isRoomPage || hideSidebar) {
      setIsCollapsed(true);
    }
  }, [isMobile, isRoomPage, hideSidebar, location.pathname]);

  return (
    <div 
      className="min-h-screen flex bg-background text-foreground overflow-hidden"
      style={{ 
        "--sidebar-width": hideSidebar ? "0px" : (isCollapsed ? "0px" : "240px")
      } as React.CSSProperties}
    >
      {!hideSidebar && (
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      )}
      
      {!isMobile && !hideSidebar && (
        <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      )}
      
      {isMobile && !hideSidebar && (
        <MobileHeader 
          onToggleSidebar={toggleSidebar} 
          isSidebarOpen={!isCollapsed}
        />
      )}
      
      <main 
        className={cn(
          "flex-1 transition-all duration-200 ease-out relative",
          isRoomPage && isMobile ? "overflow-hidden h-[100dvh] w-screen" : "overflow-x-hidden"
        )}
        style={{ 
          marginLeft: '0',
          width: '100%',
          paddingTop: isMobile ? '56px' : '0'
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
