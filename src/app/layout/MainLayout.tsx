
import { ReactNode, useState } from "react";
import { Sidebar } from "@/app/navigation/Sidebar";
import { Header } from "@/app/navigation/Header";
import { MobileHeader } from "@/app/navigation/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  // Set default to false to ensure sidebar loads fully expanded
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
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
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: isMobile ? '0' : (isCollapsed ? '70px' : '240px'),
          paddingTop: isMobile ? '56px' : '56px', // Ensure we have padding for both mobile header and desktop header
          paddingLeft: isMobile ? '16px' : '24px' // Adding left padding for better spacing
        }}
      >
        <div className="p-6 lg:p-8 transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
