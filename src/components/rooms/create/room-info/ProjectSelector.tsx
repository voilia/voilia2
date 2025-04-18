
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
  waitingForProjectRefresh?: boolean;
  projectJustCreated?: string | null;
}

export function ProjectSelector({
  selectedProjectId,
  setSelectedProjectId,
  projects,
  isLoadingProjects,
  isCreatingProject,
  setIsCreatingProject,
  handleProjectCreated,
  waitingForProjectRefresh = false,
  projectJustCreated = null,
}: ProjectSelectorProps) {
  const [isCreatingProjectAndRoom, setIsCreatingProjectAndRoom] = useState(false);
  
  // Find the currently selected project from the projects list
  const selectedProject = projects?.find(p => p.id === selectedProjectId);

  // Handle the case when a project was just created
  useEffect(() => {
    if (projectJustCreated && projects && projects.length > 0) {
      const newProject = projects.find(p => p.id === projectJustCreated);
      
      if (newProject) {
        console.log("Found newly created project in projects list, setting as selected:", newProject.id);
        setSelectedProjectId(newProject.id);
      } else if (waitingForProjectRefresh) {
        console.log("Waiting for project refresh to find newly created project:", projectJustCreated);
      }
    }
  }, [projectJustCreated, projects, setSelectedProjectId, waitingForProjectRefresh]);

  // Show loading state while waiting for project refresh
  const showLoading = isLoadingProjects || waitingForProjectRefresh;

  return (
    <div className="space-y-2">
      {isCreatingProject ? (
        <div className="space-y-4">
          <CreateProjectInline 
            onProjectCreated={(projectId) => {
              console.log("Project created callback with ID:", projectId);
              setSelectedProjectId(projectId);
              handleProjectCreated(projectId);
              if (!isCreatingProjectAndRoom) {
                setIsCreatingProject(false);
              }
            }}
            onCancel={() => {
              setIsCreatingProject(false);
              setIsCreatingProjectAndRoom(false);
            }}
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
          disabled={showLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {selectedProject ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: selectedProject.color }}
                  />
                  <span className="truncate">{selectedProject.name}</span>
                </div>
              ) : (
                <span>{showLoading ? "Loading projects..." : "Select a project"}</span>
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
                  <span className="truncate">{project.name}</span>
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
