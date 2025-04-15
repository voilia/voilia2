
import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNavItemCollapsed } from "./components/SidebarNavItemCollapsed";
import { SidebarNavItemWithChildren } from "./components/SidebarNavItemWithChildren";

interface SidebarNavItemProps {
  title: string;
  icon: LucideIcon;
  children: {
    title: string;
    path: string;
  }[];
  isCollapsed: boolean;
  onItemClick?: () => void;
}

export function SidebarNavItem({
  title,
  icon,
  children,
  isCollapsed,
  onItemClick,
}: SidebarNavItemProps) {
  return (
    <div className={cn("mb-1", isCollapsed ? "px-2" : "")}>
      {isCollapsed ? (
        <SidebarNavItemCollapsed
          title={title}
          icon={icon}
          children={children}
          onItemClick={onItemClick}
        />
      ) : (
        <SidebarNavItemWithChildren
          title={title}
          icon={icon}
          children={children}
          onItemClick={onItemClick}
        />
      )}
    </div>
  );
}
