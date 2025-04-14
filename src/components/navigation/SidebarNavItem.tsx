
import { ReactNode, useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

interface SidebarNavItemProps {
  title: string;
  icon: LucideIcon;
  path?: string;
  children?: { title: string; path: string }[];
  isCollapsed?: boolean;
  onClick?: () => void;
}

export function SidebarNavItem({
  title,
  icon: Icon,
  path,
  children,
  isCollapsed = false,
  onClick
}: SidebarNavItemProps) {
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = () => {
    // Execute the onClick handler if provided (for mobile close)
    if (onClick) {
      onClick();
    }
  };

  // If has child items
  if (children && children.length > 0) {
    return (
      <div className="w-full">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start font-normal",
            isCollapsed ? "px-2" : "px-3",
          )}
          onClick={() => setExpanded(!expanded)}
        >
          <Icon className={cn("h-5 w-5 mr-2", isCollapsed && "mr-0")} />
          {!isCollapsed && <span>{title}</span>}
          {!isCollapsed && <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", expanded && "rotate-180")} />}
        </Button>
        
        {expanded && !isCollapsed && (
          <div className="pl-8 mt-1 space-y-1">
            {children.map((child, i) => (
              <NavLink
                key={i}
                to={child.path}
                className={({ isActive }) => 
                  cn(
                    "block w-full px-3 py-2 rounded-md text-sm",
                    "transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )
                }
                onClick={handleNavClick}
              >
                {child.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  // If it's a single item with a path
  if (path) {
    return (
      <NavLink
        to={path}
        className={({ isActive }) => 
          cn(
            "flex items-center px-3 py-2 rounded-md",
            "transition-colors hover:bg-accent hover:text-accent-foreground",
            isCollapsed && "justify-center px-2",
            isActive && "bg-accent text-accent-foreground"
          )
        }
        onClick={handleNavClick}
      >
        <Icon className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
        {!isCollapsed && <span>{title}</span>}
      </NavLink>
    );
  }

  // If it's just a label or placeholder
  return (
    <div className={cn(
      "flex items-center px-3 py-2", 
      isCollapsed && "justify-center px-2"
    )}>
      <Icon className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
      {!isCollapsed && <span>{title}</span>}
    </div>
  );
}
