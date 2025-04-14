
import { LucideIcon } from "lucide-react";
import { SidebarNavItemCollapsed } from "./components/SidebarNavItemCollapsed";
import { SidebarNavItemWithChildren } from "./components/SidebarNavItemWithChildren";
import { SidebarNavItemSimple } from "./components/SidebarNavItemSimple";

interface SidebarNavItemProps {
  title: string;
  path?: string;
  icon?: LucideIcon;
  children?: {
    title: string;
    path: string;
  }[];
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

export function SidebarNavItem({
  title,
  path,
  icon,
  children,
  isCollapsed,
  onItemClick
}: SidebarNavItemProps) {
  const hasChildren = children && children.length > 0;
  
  if (isCollapsed) {
    return (
      <SidebarNavItemCollapsed 
        title={title}
        path={path}
        icon={icon}
        onItemClick={onItemClick}
      />
    );
  }

  if (hasChildren) {
    return (
      <SidebarNavItemWithChildren
        title={title}
        icon={icon}
        children={children}
        onItemClick={onItemClick}
      />
    );
  }

  return (
    <SidebarNavItemSimple
      title={title}
      path={path}
      icon={icon}
      onItemClick={onItemClick}
    />
  );
}
