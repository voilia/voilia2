import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavItemLabel } from "./NavItemLabel";
import { NavItemChildrenToggle } from "./NavItemChildrenToggle";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";

interface SidebarNavItemWithChildrenProps {
  title: string;
  icon?: LucideIcon;
  children: {
    title: string;
    path: string;
  }[];
  onItemClick?: () => void;
}

export function SidebarNavItemWithChildren({
  title,
  icon,
  children,
  onItemClick
}: SidebarNavItemWithChildrenProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile();

  const getActionText = (title: string) => {
    if (title === "All Projects") return "New Project";
    if (title === "All Rooms") return "New Room";
    return "Coming Soon";
  };

  const renderAction = (title: string) => {
    if (title === "All Projects") {
      return <CreateProjectDialog variant="icon" />;
    } else if (title === "All Rooms") {
      return null;
    } else {
      return null;
    }
  };
  
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
          {children.map((child) => (
            <div key={child.path} className="relative group">
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
              
              {(isMobile || child.title.startsWith("All")) && child.title.startsWith("All") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    {renderAction(child.title)}
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right"
                    className="bg-accent text-accent-foreground border-accent-foreground/20"
                  >
                    {getActionText(child.title)}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
