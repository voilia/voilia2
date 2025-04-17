
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  
  // Check if this is one of the special sections that need a "+" button
  const isSpecialSection = title === "Projects" || title === "Rooms" || title === "Agents";
  const isAllSection = title.startsWith("All ");

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        asChild={!!path}
        className={cn(
          "flex w-full justify-start px-3 py-2",
          "animate-fade-in",
          isSpecialSection 
            ? "text-sm font-semibold text-foreground/90 tracking-tight" // More refined header style
            : isAllSection 
              ? "text-xs font-medium text-muted-foreground/70 tracking-wide" // Softer, slightly wider spacing for 'All' sections
              : "text-xs font-normal text-muted-foreground/80 tracking-normal" // Balanced default style
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
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            {Icon && <Icon className="h-4 w-4 opacity-75" />}
            <span>{title}</span>
          </NavLink>
        ) : (
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-4 w-4 opacity-75" />}
            <span>{title}</span>
          </div>
        )}
      </Button>
      
      {isSpecialSection && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0",
            isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200"
          )}
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Create new ${title}`);
          }}
        >
          <Plus className="h-3.5 w-3.5 opacity-60" />
          <span className="sr-only">Add new {title}</span>
        </Button>
      )}
    </div>
  );
}
