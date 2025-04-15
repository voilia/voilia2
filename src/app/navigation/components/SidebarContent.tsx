
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarHeader } from "./SidebarHeader";
import { useSidebarNavItems } from "@/config/navigation";

interface SidebarContentProps {
  isCollapsed: boolean;
  onNavItemClick?: () => void;
}

export function SidebarContent({ isCollapsed, onNavItemClick }: SidebarContentProps) {
  const sidebarNavItems = useSidebarNavItems();
  
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SidebarHeader isCollapsed={isCollapsed} />
      <SidebarNavigation 
        isCollapsed={isCollapsed} 
        onNavItemClick={onNavItemClick}
        navItems={sidebarNavItems} 
      />
    </div>
  );
}
