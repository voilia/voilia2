
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarNavItem } from "@/components/navigation/SidebarNavItem";
import { ChevronLeft, ChevronRight, FolderOpen, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { sidebarNavItems } from "@/config/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
}

export function Sidebar({ className, isCollapsed = false, toggleSidebar }: SidebarProps) {
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else if (toggleSidebar) {
      toggleSidebar();
    }
  };

  const sidebarContent = (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border backdrop-blur-md bg-sidebar/90",
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
        
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-sidebar-accent/50 transition-all duration-200 active:scale-95"
          >
            <Avatar className="h-8 w-8 border border-sidebar-border">
              <AvatarFallback className="bg-sidebar-primary/10 text-sidebar-primary text-sm">
                UV
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">User profile</span>
          </Button>
        )}
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSidebar}
            className="rounded-full hover:bg-sidebar-accent/50 transition-all duration-200 active:scale-95"
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
      onClick={handleToggleSidebar}
      className="fixed top-4 left-4 z-50 rounded-full shadow-md hover:bg-accent/50 transition-all duration-200 active:scale-95"
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
