
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavItemLabel } from "./NavItemLabel";
import { NavItemChildrenToggle } from "./NavItemChildrenToggle";
import { NavActionButton } from "./buttons/NavActionButton";

interface SidebarNavItemWithChildrenProps {
  title: string;
  icon?: LucideIcon;
  childItems: {
    title: string;
    path: string;
  }[];
  onItemClick?: () => void;
}

export function SidebarNavItemWithChildren({
  title,
  icon,
  childItems,
  onItemClick
}: SidebarNavItemWithChildrenProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile();
  
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
        <NavItemLabel title={title} icon={icon} />
        <NavItemChildrenToggle isOpen={isOpen} />
      </Button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 pl-2 pt-1">
          {childItems.map((child, index) => (
            <div key={`${child.path}-${index}`} className="relative group">
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start px-3 py-1.5 text-base"
                onClick={onItemClick}
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
              
              {child.title.startsWith("All") && (
                <NavActionButton
                  type={child.title === "All Projects" ? "project" : "room"}
                  isMobile={isMobile}
                  tooltipText={child.title === "All Rooms" ? "New Room" : undefined}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
