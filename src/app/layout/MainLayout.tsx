
import { ReactNode, useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/app/navigation/Sidebar";
import { Header } from "@/app/navigation/Header";
import { MobileHeader } from "@/app/navigation/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);
  
  // Calculate sidebar width based on device and collapsed state
  const sidebarWidth = isMobile 
    ? "0px" 
    : (isCollapsed ? "0px" : "240px");
  
  return (
    <div 
      className="min-h-screen flex bg-background text-foreground"
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
        className="flex-1 transition-all duration-200 ease-out overflow-x-hidden"
        style={{ 
          marginLeft: isMobile ? '0' : (isCollapsed ? '0' : '240px'),
          paddingTop: isMobile ? '56px' : '2rem',
        }}
      >
        <div className="px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
