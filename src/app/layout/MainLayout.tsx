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
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);
  
  return (
    <div className="min-h-screen flex bg-background text-foreground">
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
        className="flex-1 transition-all duration-300 ease-in-out overflow-x-hidden"
        style={{ 
          marginLeft: isMobile ? '0' : (isCollapsed ? '0' : '240px'),
          paddingTop: isMobile ? '56px' : '3.5rem',
        }}
      >
        <div className="p-4 md:p-6 lg:p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
