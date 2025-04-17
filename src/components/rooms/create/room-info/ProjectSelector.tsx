
import { useState } from "react";
import { Project } from "@/components/projects/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { CreateProjectInline } from "@/components/projects/CreateProjectInline";

interface ProjectSelectorProps {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  projects: Project[];
  isLoadingProjects: boolean;
  isCreatingProject: boolean;
  setIsCreatingProject: (creating: boolean) => void;
  handleProjectCreated: (newProjectId: string) => void;
}

export function ProjectSelector({
  selectedProjectId,
  setSelectedProjectId,
  projects,
  isLoadingProjects,
  isCreatingProject,
  setIsCreatingProject,
  handleProjectCreated,
}: ProjectSelectorProps) {
  return (
    <div className="space-y-2">
      {isCreatingProject ? (
        <div className="space-y-4">
          <CreateProjectInline 
            onProjectCreated={handleProjectCreated}
            onCancel={() => setIsCreatingProject(false)}
          />
        </div>
      ) : (
        <Select
          value={selectedProjectId || undefined}
          onValueChange={(value) => {
            if (value === "create-new") {
              setIsCreatingProject(true);
            } else {
              setSelectedProjectId(value);
            }
          }}
          disabled={isLoadingProjects}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </div>
              </SelectItem>
            ))}
            <SelectItem value="create-new">
              <div className="flex items-center text-primary gap-2">
                <Plus className="h-3.5 w-3.5" />
                Create New Project
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
