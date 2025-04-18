
import { useState, useEffect } from "react";
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
  // Track if we're in the process of creating both a project and room
  const [isCreatingProjectAndRoom, setIsCreatingProjectAndRoom] = useState(false);
  
  // Find the currently selected project from the projects list
  const selectedProject = projects?.find(p => p.id === selectedProjectId);

  // This effect ensures the dropdown shows the selected project after creation
  useEffect(() => {
    if (selectedProjectId && projects && projects.length > 0) {
      // If a project ID is selected but not found in the list, it might be because
      // the list hasn't been refreshed yet - we handle this in handleProjectCreated
      const projectExists = projects.some(p => p.id === selectedProjectId);
      if (!projectExists) {
        console.log("Selected project not found in list, will be refreshed soon");
      }
    }
  }, [selectedProjectId, projects]);

  return (
    <div className="space-y-2">
      {isCreatingProject ? (
        <div className="space-y-4">
          <CreateProjectInline 
            onProjectCreated={(projectId) => {
              // Set the selected project ID
              setSelectedProjectId(projectId);
              // Call handleProjectCreated to refresh the projects list
              handleProjectCreated(projectId);
              // Keep the create project form open if we're creating both
              if (!isCreatingProjectAndRoom) {
                setIsCreatingProject(false);
              }
            }}
            onCancel={() => {
              setIsCreatingProject(false);
              setIsCreatingProjectAndRoom(false);
            }}
            // Allow continuing to room creation
            allowContinueToRoom={true}
            onContinueToRoom={() => {
              setIsCreatingProjectAndRoom(true);
            }}
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
            <SelectValue placeholder="Select a project">
              {selectedProject && (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: selectedProject.color }}
                  />
                  {selectedProject.name}
                </div>
              )}
            </SelectValue>
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
