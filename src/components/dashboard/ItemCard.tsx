
import React from 'react';
import { NavLink } from "react-router-dom";
import { Folder, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  path: string;
  isPinned?: boolean;
  color?: string;
  className?: string;
}

export function ItemCard({
  title,
  description,
  icon: Icon = Folder,
  path,
  isPinned = false,
  color = "#9b87f5",
  className,
}: ItemCardProps) {
  // Safely use inline styles for dynamic colors
  const iconStyles = {
    backgroundColor: `${color}20`, // 20 = 12% opacity
    color: color,
  };
  
  const iconHoverStyles = {
    '--hover-bg': `${color}33`, // 33 = 20% opacity
  } as React.CSSProperties;

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "group relative block h-[160px] rounded-2xl glassmorphic-card p-6 transition-all",
          "hover:scale-[1.01] hover:bg-accent/5 dark:hover:bg-white/[0.02] hover:shadow-md",
          isActive && "border-l-4 border-l-primary",
          className
        )
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="rounded-full p-2 transition-colors hover:bg-[var(--hover-bg)]"
            style={{...iconStyles, ...iconHoverStyles}}
          >
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-accent/80 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              {isPinned ? "Unpin" : "Pin"} Project
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Project</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
          {description}
        </p>
      )}

      {isPinned && (
        <div 
          className="absolute bottom-3 right-3 h-2 w-2 rounded-full animate-pulse-subtle"
          style={{ backgroundColor: color }}
        />
      )}
    </NavLink>
  );
}
