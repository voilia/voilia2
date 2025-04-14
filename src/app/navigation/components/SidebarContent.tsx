
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";

interface SidebarContentProps {
  isCollapsed: boolean;
  onNavItemClick?: () => void;
}

export function SidebarContent({ isCollapsed, onNavItemClick }: SidebarContentProps) {
  return (
    <>
      <SidebarHeader isCollapsed={isCollapsed} />
      <SidebarNavigation 
        isCollapsed={isCollapsed} 
        onNavItemClick={onNavItemClick}
      />
    </>
  );
}
