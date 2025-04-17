
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
}: StepOneProps) {
  return (
    <div className="space-y-5 py-4">
      <ProjectSelector
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        projects={projects}
        isLoadingProjects={isLoadingProjects}
        isCreatingProject={isCreatingProject}
        setIsCreatingProject={setIsCreatingProject}
        handleProjectCreated={handleProjectCreated}
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
