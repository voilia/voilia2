
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "@/app/navigation/SidebarNavItem";

interface NavItem {
  title: string;
  icon: React.ComponentType<any>;
  children: {
    title: string;
    path: string;
  }[];
}

interface SidebarNavigationProps {
  isCollapsed: boolean;
  onNavItemClick?: () => void;
  navItems: NavItem[];
}

export function SidebarNavigation({ isCollapsed, onNavItemClick, navItems }: SidebarNavigationProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1 overflow-y-auto p-3 flex-grow",
      isCollapsed && "items-center"
    )}>
      {navItems.map((item, index) => (
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
