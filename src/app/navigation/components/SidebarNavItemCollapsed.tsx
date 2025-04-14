
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemCollapsedProps {
  title: string;
  path?: string;
  icon?: LucideIcon;
  onItemClick?: () => void;
}

export function SidebarNavItemCollapsed({
  title,
  path,
  icon: Icon,
  onItemClick
}: SidebarNavItemCollapsedProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild={!!path}
      className="h-9 w-9 my-1"
      onClick={onItemClick}
    >
      {path ? (
        <NavLink
          to={path}
          className={({ isActive }) =>
            cn(
              "flex items-center justify-center rounded-md",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )
          }
        >
          {Icon && <Icon className="h-5 w-5" />}
          <span className="sr-only">{title}</span>
        </NavLink>
      ) : (
        <div className="flex items-center justify-center">
          {Icon && <Icon className="h-5 w-5" />}
          <span className="sr-only">{title}</span>
        </div>
      )}
    </Button>
  );
}
