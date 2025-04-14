
import { ReactNode, useState } from "react";
import { Sidebar } from "@/app/navigation/Sidebar";
import { Header } from "@/app/navigation/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* Only show toggle button when sidebar is collapsed on desktop */}
      {!isMobile && isCollapsed && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      )}
      
      <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      <main 
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: isMobile ? '0' : (isCollapsed ? '0' : '240px'),
          paddingTop: isMobile ? '0' : '56px'
        }}
      >
        <div className="p-6 lg:p-8 transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
