
import { Project, ProjectColor } from "@/components/projects/types";
import { ProjectSelector } from "./room-info/ProjectSelector";
import { RoomBasicInfo } from "./room-info/RoomBasicInfo";

interface StepOneProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  color: ProjectColor;
  setColor: (color: ProjectColor) => void;
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

export function StepOne({
  name,
  setName,
  description,
  setDescription,
  color,
  setColor,
  selectedProjectId,
  setSelectedProjectId,
  projects,
  isLoadingProjects,
  isCreatingProject,
  setIsCreatingProject,
  handleProjectCreated,
  waitingForProjectRefresh,
  projectJustCreated,
}: StepOneProps) {
  console.log("StepOne rendering with selected project:", selectedProjectId);
  console.log("Available projects:", projects);
  console.log("Project just created:", projectJustCreated);
  console.log("Waiting for refresh:", waitingForProjectRefresh);

  return (
    <div className="space-y-6">
      <ProjectSelector
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        projects={projects}
        isLoadingProjects={isLoadingProjects}
        isCreatingProject={isCreatingProject}
        setIsCreatingProject={setIsCreatingProject}
        handleProjectCreated={handleProjectCreated}
        waitingForProjectRefresh={waitingForProjectRefresh}
        projectJustCreated={projectJustCreated}
      />
      
      <RoomBasicInfo
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        color={color}
        setColor={setColor}
      />
    </div>
  );
}
