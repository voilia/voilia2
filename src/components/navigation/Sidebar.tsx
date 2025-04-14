import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarNavItem } from "@/components/navigation/SidebarNavItem";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
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
        "fixed inset-y-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        isMobile ? (isMobileSidebarOpen ? "left-0" : "-left-full") : "left-0",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">VOILIA</span>
            </div>
          )}
          {isCollapsed && <FolderOpen className="h-6 w-6 mx-auto text-primary" />}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col gap-1 overflow-y-auto p-3",
          isCollapsed ? "items-center" : ""
        )}
      >
        {sidebarNavItems.map((item, index) => (
          <SidebarNavItem
            key={index}
            title={item.title}
            path={item.path}
            icon={item.icon}
            children={item.children}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
      <div className="mt-auto p-4 border-t border-sidebar-border flex justify-between items-center">
        <ThemeToggle />
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full"
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
      className="fixed top-4 left-4 z-50 rounded-full shadow-md"
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
}
