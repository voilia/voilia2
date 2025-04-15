
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
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

  const getActionButton = (childTitle: string) => {
    const showToast = (title: string) => {
      toast({
        title,
        description: "This feature is coming soon!",
      });
    };

    if (childTitle === "All Projects") {
      return (
        <CreateProjectDialog 
          variant="icon"
          className={cn(
            isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            "absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-200"
          )}
        />
      );
    }

    const tooltipText = childTitle === "All Rooms" ? "New Room" : "Coming Soon";
    
    const ButtonComponent = () => (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          "absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 transition-opacity duration-200"
        )}
        onClick={(e) => {
          e.stopPropagation();
          showToast(tooltipText);
        }}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">{tooltipText}</span>
      </Button>
    );

    return !isMobile ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <ButtonComponent />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="right"
          className="bg-secondary text-secondary-foreground"
        >
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    ) : (
      <ButtonComponent />
    );
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
              
              {child.title.startsWith("All") && getActionButton(child.title)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
