
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { NavItemLabel } from "./NavItemLabel";
import { NavItemChildrenToggle } from "./NavItemChildrenToggle";

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

  const handleAddClick = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    if (title === "All Projects") {
      toast({
        title: "Create Project",
        description: "Project creation functionality coming soon!",
      });
    } else if (title === "All Rooms") {
      toast({
        title: "Create Room",
        description: "Room creation functionality coming soon!",
      });
    } else {
      toast({
        title: "Coming Soon",
        description: "This feature is not available yet.",
      });
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
              
              {(isMobile || child.title.startsWith("All")) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0",
                        isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                        "transition-opacity duration-200 hover:bg-accent/50"
                      )}
                      onClick={(e) => handleAddClick(e, child.title)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add new {child.title.replace('All ', '')}</span>
                    </Button>
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
