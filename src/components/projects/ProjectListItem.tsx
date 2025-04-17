
import { NavLink } from "react-router-dom";
import { Folder, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "./types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ProjectListItemProps {
  project: Project;
}

export function ProjectListItem({ project }: ProjectListItemProps) {
  // Safely use inline styles for dynamic colors
  const iconStyles = {
    backgroundColor: `${project.color}20`, // 20 = 12% opacity
    color: project.color,
  };
  
  const iconHoverStyles = {
    '--hover-bg': `${project.color}33`, // 33 = 20% opacity
  } as React.CSSProperties;

  return (
    <NavLink
      to={`/projects/${project.id}`}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center justify-between gap-4 rounded-xl border p-4 transition-all",
          "modern-card",
          "hover:scale-[1.01] dark:hover:border-[#9b87f5]/30",
          isActive && "border-l-4 border-l-primary"
        )
      }
    >
      <div className="flex items-center gap-4">
        <div
          className="rounded-full p-2 transition-colors hover:bg-[var(--hover-bg)]"
          style={{...iconStyles, ...iconHoverStyles}}
        >
          <Folder className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium line-clamp-1">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {project.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">
          Updated {format(new Date(project.updated_at), "MMM d, yyyy")}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-accent/80 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Project</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div 
        className="absolute bottom-3 right-3 h-2 w-2 rounded-full"
        style={{ backgroundColor: project.color || '#9b87f5' }}
      />
    </NavLink>
  );
}
