
import { ReactNode, useState, useCallback } from "react";
import { Sidebar } from "@/app/navigation/Sidebar";
import { Header } from "@/app/navigation/Header";
import { MobileHeader } from "@/app/navigation/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  // Set default to true to ensure sidebar loads fully collapsed
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);
  
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Main sidebar that handles both mobile and desktop */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* Show header for non-mobile view at all times */}
      {!isMobile && (
        <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      )}
      
      {/* Show mobile header only on mobile */}
      {isMobile && (
        <MobileHeader onToggleSidebar={toggleSidebar} />
      )}
      
      <main 
        className="flex-1 transition-all duration-300 ease-in-out overflow-x-hidden"
        style={{ 
          marginLeft: isMobile ? '0' : (isCollapsed ? '0' : '240px'),
          paddingTop: '56px', // Same padding for both mobile and desktop headers
        }}
      >
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
