
import { useState } from "react";

export function useProjectCreation() {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectJustCreated, setProjectJustCreated] = useState<string | null>(null);
  const [waitingForProjectRefresh, setWaitingForProjectRefresh] = useState(false);

  const resetProjectCreation = () => {
    setIsCreatingProject(false);
    setProjectJustCreated(null);
    setWaitingForProjectRefresh(false);
  };

  return {
    isCreatingProject,
    setIsCreatingProject,
    projectJustCreated,
    setProjectJustCreated,
    waitingForProjectRefresh,
    setWaitingForProjectRefresh,
    resetProjectCreation,
  };
}
