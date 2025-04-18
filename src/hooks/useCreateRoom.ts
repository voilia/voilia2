
import { projectColors } from "@/components/projects/types";
import { useRoomForm } from "./rooms/useRoomForm";
import { useProjectCreation } from "./rooms/useProjectCreation";
import { useRoomSubmission } from "./rooms/useRoomSubmission";
import { useProjects } from "./useProjects";

export function useCreateRoom(initialProjectId?: string) {
  const { refreshProjects, fetchProjects } = useProjects();
  const form = useRoomForm(initialProjectId);
  const projectCreation = useProjectCreation();
  const { isLoading, handleSubmit: submitRoom } = useRoomSubmission();

  const handleProjectCreated = async (newProjectId: string) => {
    console.log("Project created with ID:", newProjectId);
    
    form.setSelectedProjectId(newProjectId);
    projectCreation.setIsCreatingProject(false);
    projectCreation.setProjectJustCreated(newProjectId);
    projectCreation.setWaitingForProjectRefresh(true);
    
    try {
      await refreshProjects();
      
      const retryIntervals = [500, 1000, 2000, 3000];
      
      for (const interval of retryIntervals) {
        setTimeout(async () => {
          console.log(`Retrying project refresh after ${interval}ms`);
          const latestProjects = await fetchProjects();
          
          if (latestProjects && latestProjects.some(p => p.id === newProjectId)) {
            console.log(`Found project after ${interval}ms retry`);
            projectCreation.setWaitingForProjectRefresh(false);
          }
        }, interval);
      }
    } catch (error) {
      console.error("Error in initial project refresh:", error);
    }
  };

  const handleSubmit = async () => {
    return submitRoom({
      selectedProjectId: form.selectedProjectId,
      name: form.name,
      description: form.description,
      color: projectColors[form.color],
      selectedAgentIds: form.selectedAgentIds,
    });
  };

  const resetForm = () => {
    form.resetForm();
    projectCreation.resetProjectCreation();
  };

  return {
    // Form state
    ...form,
    // Project creation state
    ...projectCreation,
    // Submission state and handlers
    isLoading,
    handleSubmit,
    handleProjectCreated,
    resetForm,
  };
}
