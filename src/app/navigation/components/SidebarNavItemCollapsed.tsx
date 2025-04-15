
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavItemCollapsedProps {
  title: string;
  icon: LucideIcon;
  navItems?: {
    title: string;
    path: string;
  }[];
  onItemClick?: () => void;
}

export function SidebarNavItemCollapsed({
  title,
  icon: Icon,
  navItems,
  onItemClick
}: SidebarNavItemCollapsedProps) {
  // Create a button component to avoid prop forwarding issues
  const IconButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 my-1"
      onClick={onItemClick}
    >
      <Icon className="h-5 w-5" />
      <span className="sr-only">{title}</span>
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton />
      </TooltipTrigger>
      <TooltipContent side="right" className="flex flex-col gap-1">
        <span className="font-medium">{title}</span>
        {navItems && navItems.length > 0 && (
          <div className="space-y-1 pt-1 text-xs">
            {navItems.map((item, index) => (
              <NavLink 
                key={index} 
                to={item.path}
                className="block hover:underline"
                onClick={onItemClick}
              >
                {item.title}
              </NavLink>
            ))}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
