
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarNavItem } from "@/app/navigation/SidebarNavItem";
import { ChevronLeft, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { sidebarNavItems } from "@/config/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HeaderControls } from "@/app/navigation/HeaderControls";

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
  
  const handleNavItemClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border backdrop-blur-md bg-sidebar/90",
        isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-[240px]",
        isMobile ? (isMobileSidebarOpen ? "left-0" : "-left-full") : "left-0",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      <div className={cn(
        "flex h-14 items-center border-b border-sidebar-border px-4 justify-center",
        isCollapsed ? "opacity-0 hidden" : "opacity-100"
      )}>
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/f8cf0e0e-b715-4873-9611-ac7f615574be.png" 
            alt="Voilia Logo" 
            className="w-24 h-8"
          />
        </div>
      </div>
      
      <div className={cn(
        "flex flex-col gap-1 overflow-y-auto p-3 flex-grow",
        isCollapsed ? "opacity-0 hidden" : "opacity-100"
      )}>
        {sidebarNavItems.map((item, index) => (
          <SidebarNavItem
            key={index}
            title={item.title}
            icon={item.icon}
            children={item.children}
            isCollapsed={isCollapsed}
            onItemClick={handleNavItemClick}
          />
        ))}
      </div>
      
      {/* Footer for mobile - contains theme toggle and profile */}
      {isMobile && (
        <div className={cn(
          "mt-auto p-4 border-t border-sidebar-border flex justify-between items-center",
          isCollapsed ? "opacity-0 hidden" : "opacity-100"
        )}>
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
          >
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                UV
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">User profile</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSidebar}
            className="rounded-full hover:bg-sidebar-accent/50 transition-all duration-200 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  const mobileToggle = isMobile && (
    <Button
      variant="ghost" 
      size="icon" 
      onClick={handleToggleSidebar}
      className="fixed top-3 left-2 z-50 rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
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
