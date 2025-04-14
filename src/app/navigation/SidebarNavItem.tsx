
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  // Start with items expanded by default
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = children && children.length > 0;
  const isMobile = useIsMobile();
  
  // Check if this is one of the special sections that need a "+" button
  const isSpecialSection = title === "All Projects" || title === "All Rooms" || title === "All Agents";

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
          {Icon && <Icon className="h-5 w-5" />}
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
            "flex w-full items-center justify-between px-3 py-2 text-base font-medium",
            "hover:bg-sidebar-accent/50"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5" />}
            <span>{title}</span>
          </div>
          <div className="flex items-center">
            {isOpen ? (
              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground/50" />
            ) : (
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50" />
            )}
          </div>
        </Button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1 pl-2 pt-1">
            {children.map((child) => (
              <div key={child.path} className="relative group">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start px-3 py-1.5 text-base"
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
                
                {isSpecialSection && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0",
                      isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-200"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Create new ${title.replace('All ', '')}`);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add new {title.replace('All ', '')}</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        asChild
        className={cn(
          "flex w-full justify-start px-3 py-2 text-base font-medium",
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
          {Icon && <Icon className="h-5 w-5" />}
          <span>{title}</span>
        </NavLink>
      </Button>
      
      {isSpecialSection && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0",
            isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200"
          )}
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Create new ${title.replace('All ', '')}`);
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add new {title.replace('All ', '')}</span>
        </Button>
      )}
    </div>
  );
}
