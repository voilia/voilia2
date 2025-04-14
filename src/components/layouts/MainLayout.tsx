
import { ReactNode, useState } from "react";
import { Sidebar } from "@/app/navigation/Sidebar";
import { Header } from "@/components/navigation/Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isMobile ? 'pl-0 pt-0' : `ml-[${isCollapsed ? '70px' : '240px'}] pt-14`
        }`}
      >
        <div className="p-6 lg:p-8 transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
