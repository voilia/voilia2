
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarNavItem } from "@/components/navigation/SidebarNavItem";
import { ChevronLeft, ChevronRight, FolderOpen, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { sidebarNavItems } from "@/config/navigation";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const sidebarContent = (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border flowing-gradient shadow-lg",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        isMobile ? (isMobileSidebarOpen ? "left-0" : "-left-full") : "left-0",
        "transition-all duration-500 ease-in-out",
        className
      )}
    >
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2 w-full">
          {!isCollapsed && (
            <div className="flex items-center space-x-2 animate-scale">
              <div className="glass-morphism p-2 rounded-md">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold text-lg text-glow">VOILIA</span>
            </div>
          )}
          {isCollapsed && (
            <div className="glass-morphism p-2 rounded-md mx-auto animate-scale">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col gap-1 overflow-y-auto p-3 transition-all duration-500",
          isCollapsed ? "items-center" : ""
        )}
      >
        {sidebarNavItems.map((item, index) => (
          <div 
            key={index} 
            style={{ animationDelay: `${index * 0.05}s` }}
            className="animate-in"
          >
            <SidebarNavItem
              title={item.title}
              path={item.path}
              icon={item.icon}
              children={item.children}
              isCollapsed={isCollapsed}
            />
          </div>
        ))}
      </div>
      <div className="mt-auto p-4 border-t border-sidebar-border flex justify-between items-center glass-morphism bg-opacity-20">
        <ThemeToggle />
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full hover-effect"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );

  const mobileToggle = isMobile && (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 rounded-full shadow-md glass-morphism hover-effect"
    >
      {isMobileSidebarOpen ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <>
      {sidebarContent}
      {mobileToggle}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
}
