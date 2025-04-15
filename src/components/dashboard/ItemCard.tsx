
import { cn } from "@/lib/utils";
import { LucideIcon, MoreHorizontal } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ItemCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  path: string;
  isPinned?: boolean;
  color?: string;
  className?: string;
}

export function ItemCard({
  title,
  description,
  icon: Icon,
  path,
  isPinned = false,
  color = "#9b87f5",
  className,
}: ItemCardProps) {
  const darkMode = document.documentElement.classList.contains("dark");
  const iconColorClass = darkMode 
    ? `bg-[${color}]/30 text-[${color}]/400` 
    : `bg-[${color}]/20 text-[${color}]/700`;

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "group relative block h-[160px] rounded-2xl border p-6 transition-all",
          "bg-white dark:bg-[#342a52] dark:border-white/5",
          "hover:scale-[1.01] hover:shadow-md dark:hover:border-[#9b87f5]/30",
          isActive && "border-l-4 border-l-primary",
          className
        )
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn("rounded-full p-2", iconColorClass)}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 absolute top-3 right-3 opacity-100 text-muted-foreground hover:bg-accent/80"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              {isPinned ? "Unpin" : "Pin"} Project
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Project</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {description}
        </p>
      )}

      {isPinned && (
        <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
      )}
    </NavLink>
  );
}
