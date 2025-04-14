
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  title: string;
  path?: string;
  icon?: LucideIcon;
  children?: {
    title: string;
    path: string;
  }[];
  isCollapsed?: boolean;
}

export function SidebarNavItem({
  title,
  path,
  icon: Icon,
  children,
  isCollapsed,
}: SidebarNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children && children.length > 0;

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="h-9 w-9 my-1"
      >
        <NavLink
          to={path || "#"}
          className={({ isActive }) =>
            cn(
              "flex items-center justify-center rounded-md",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )
          }
        >
          {Icon && <Icon className="h-4 w-4" />}
          <span className="sr-only">{title}</span>
        </NavLink>
      </Button>
    );
  }

  if (hasChildren) {
    return (
      <div className="animate-fade-in">
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center justify-between px-3 py-2 text-sm font-medium",
            "hover:bg-sidebar-accent/50"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{title}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/50" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
          )}
        </Button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l pl-2 pt-1">
            {children.map((child) => (
              <Button
                key={child.path}
                variant="ghost"
                asChild
                className="w-full justify-start px-3 py-1.5 text-sm"
              >
                <NavLink
                  to={child.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-start gap-2 rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <span>{child.title}</span>
                </NavLink>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "flex w-full justify-start px-3 py-2 text-sm font-medium",
        "animate-fade-in"
      )}
    >
      <NavLink
        to={path || "#"}
        className={({ isActive }) =>
          cn(
            "flex w-full items-center gap-3 rounded-md",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )
        }
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{title}</span>
      </NavLink>
    </Button>
  );
}
