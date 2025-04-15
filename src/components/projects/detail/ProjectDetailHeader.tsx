
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectTitleEditor } from "./header/ProjectTitleEditor";
import { ProjectDescriptionEditor } from "./header/ProjectDescriptionEditor";
import { ProjectActions } from "./header/ProjectActions";
import { ProjectOwnerInfo } from "./header/ProjectOwnerInfo";

interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  color?: string;
}

interface ProjectDetailHeaderProps {
  project?: Project;
  isLoading: boolean;
}

export function ProjectDetailHeader({ project, isLoading }: ProjectDetailHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const isMobile = useIsMobile();
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        setIsEditingDescription(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <Skeleton className="h-10 w-3/4 max-w-md" />
        <Skeleton className="h-16 w-full max-w-2xl" />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={editRef}>
      <div className="flex items-start justify-between flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <ProjectTitleEditor
            project={project!}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
        <ProjectActions 
          isMobile={isMobile} 
          onEditClick={() => setIsEditing(true)} 
        />
      </div>

      <ProjectDescriptionEditor
        project={project!}
        isEditing={isEditingDescription}
        setIsEditing={setIsEditingDescription}
      />

      <ProjectOwnerInfo createdAt={project?.created_at} />
    </div>
  );
}
