
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNavItemCollapsed } from "./SidebarNavItemCollapsed";
import { SidebarNavItemWithChildren } from "./SidebarNavItemWithChildren";
import { useLocation } from "react-router-dom";

interface SidebarNavItemSimpleProps {
  title: string;
  icon: LucideIcon;
  children: {
    title: string;
    path: string;
  }[];
  actionButton?: {
    type: "project" | "room" | "generic";
    tooltipText?: string;
  };
  isCollapsed: boolean;
  onItemClick?: () => void;
}

export function SidebarNavItem({
  title,
  icon,
  children,
  actionButton,
  isCollapsed,
  onItemClick,
}: SidebarNavItemSimpleProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const projectId = currentPath.startsWith('/projects/') ? currentPath.split('/')[2] : undefined;
  
  return (
    <div className={cn("mb-1", isCollapsed ? "px-2" : "")}>
      {isCollapsed ? (
        <SidebarNavItemCollapsed
          title={title}
          icon={icon}
          navItems={children}
          onItemClick={onItemClick}
        />
      ) : (
        <SidebarNavItemWithChildren
          title={title}
          icon={icon}
          childItems={children}
          actionButton={actionButton}
          onItemClick={onItemClick}
          projectId={projectId}
        />
      )}
    </div>
  );
}
