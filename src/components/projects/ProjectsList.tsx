
import { useMemo } from "react";
import { Project, SortOption, ViewMode } from "@/components/projects/types";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { Folder } from "lucide-react";

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
  viewMode: ViewMode;
  sortOption: SortOption;
}

export function ProjectsList({ projects, isLoading, viewMode, sortOption }: ProjectsListProps) {
  const sortedProjects = useMemo(() => {
    if (!projects) return [];
    
    return [...projects].sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "created_at") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        // default: updated_at
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [projects, sortOption]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="h-[160px] rounded-2xl border bg-muted/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProjects.map((project) => (
          <ItemCard
            key={project.id}
            title={project.name}
            description={project.description || ""}
            icon={Folder}
            path={`/projects/${project.id}`}
            color={project.color || "#9b87f5"}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {sortedProjects.map((project) => (
        <ProjectListItem 
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}
