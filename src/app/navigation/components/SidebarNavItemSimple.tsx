
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface SidebarNavItemSimpleProps {
  title: string;
  path?: string;
  icon?: LucideIcon;
  onItemClick?: () => void;
}

export function SidebarNavItemSimple({
  title,
  path,
  icon: Icon,
  onItemClick
}: SidebarNavItemSimpleProps) {
  const isMobile = useIsMobile();
  
  const getActionComponent = (title: string) => {
    if (title === "All Projects") {
      return <CreateProjectDialog variant="icon" />;
    } else if (title === "All Rooms") {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            toast.info("Room creation coming soon!");
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">New Room</span>
        </Button>
      );
    } else if (title === "All Agents") {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            toast.info("Agent creation coming soon!");
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">New Agent</span>
        </Button>
      );
    }
    return null;
  };

  const getTooltipContent = (title: string) => {
    if (title === "All Projects") return "New Project";
    if (title === "All Rooms") return "New Room";
    if (title === "All Agents") return "Coming Soon";
    return "";
  };

  // Only show action buttons for All Projects, All Rooms, and All Agents
  const shouldShowAction = title.startsWith("All");
  const actionComponent = shouldShowAction ? getActionComponent(title) : null;
  const tooltipContent = shouldShowAction ? getTooltipContent(title) : "";

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        asChild={!!path}
        className={cn(
          "flex w-full justify-start px-3 py-2 text-base font-medium",
          "animate-fade-in"
        )}
        onClick={onItemClick}
      >
        {path ? (
          <NavLink
            to={path}
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
        ) : (
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5" />}
            <span>{title}</span>
          </div>
        )}
      </Button>
      
      {actionComponent && (
        <div className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2",
          !isMobile && "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              {actionComponent}
            </TooltipTrigger>
            <TooltipContent 
              side="right"
              className="bg-accent text-accent-foreground border-accent-foreground/20"
            >
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
