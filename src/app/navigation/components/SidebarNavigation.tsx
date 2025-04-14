
import { cn } from "@/lib/utils";
import { sidebarNavItems } from "@/config/navigation";
import { SidebarNavItem } from "@/app/navigation/SidebarNavItem";

interface SidebarNavigationProps {
  isCollapsed: boolean;
  onNavItemClick?: () => void;
}

export function SidebarNavigation({ isCollapsed, onNavItemClick }: SidebarNavigationProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1 overflow-y-auto p-3 flex-grow",
      isCollapsed && "items-center"
    )}>
      {sidebarNavItems.map((item, index) => (
        <SidebarNavItem
          key={index}
          title={item.title}
          icon={item.icon}
          children={item.children}
          isCollapsed={isCollapsed}
          onItemClick={onNavItemClick}
        />
      ))}
    </div>
  );
}
