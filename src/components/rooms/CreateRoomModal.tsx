
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StepOne } from "./create/StepOne";
import { StepTwo } from "./create/StepTwo";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { StepIndicator } from "./create/navigation/StepIndicator";
import { CreateRoomFooter } from "./create/navigation/CreateRoomFooter";
import { useProjects } from "@/hooks/useProjects";
import { useEffect } from "react";

interface CreateRoomModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialProjectId?: string;
}

export function CreateRoomModal({ 
  isOpen, 
  onOpenChange,
  initialProjectId 
}: CreateRoomModalProps) {
  const { projects, isLoading: isLoadingProjects, refreshProjects } = useProjects();
  const {
    currentStep,
    setCurrentStep,
    name,
    setName,
    description,
    setDescription,
    color,
    setColor,
    selectedProjectId,
    setSelectedProjectId,
    selectedAgentIds,
    toggleAgentSelection,
    isCreatingProject,
    setIsCreatingProject,
    searchQuery,
    setSearchQuery,
    showAllAgents,
    setShowAllAgents,
    isLoading,
    handleSubmit,
    handleProjectCreated,
    resetForm,
    projectJustCreated,
    waitingForProjectRefresh
  } = useCreateRoom(initialProjectId);

  // Refresh projects when modal opens, but only when actually visible
  useEffect(() => {
    if (isOpen) {
      refreshProjects();
    }
  }, [isOpen, refreshProjects]);

  // Check if Next button should be disabled (Step 1, no project selected, creating project)
  const isNextDisabled = currentStep === 1 && 
    (!selectedProjectId || isCreatingProject || waitingForProjectRefresh);

  // Only log debug info when the modal is actually open to prevent unnecessary logs
  useEffect(() => {
    if (isOpen && process.env.NODE_ENV === 'development') {
      console.log("CreateRoomModal - selectedProjectId:", selectedProjectId);
      console.log("CreateRoomModal - projectJustCreated:", projectJustCreated);
      console.log("CreateRoomModal - waitingForProjectRefresh:", waitingForProjectRefresh);
      console.log("CreateRoomModal - projects count:", projects?.length);
    }
  }, [isOpen, selectedProjectId, projectJustCreated, waitingForProjectRefresh, projects?.length]);

  if (!isOpen) {
    return null; // Don't render anything when modal is closed
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden rounded-xl">
        <div className="border-b p-4 pb-3">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">Create New Room</DialogTitle>
            <DialogDescription className="text-base mt-1">
              Create a collaborative space with AI agents
            </DialogDescription>
          </DialogHeader>
          <StepIndicator currentStep={currentStep} />
        </div>
        
        <div className="p-4 space-y-5">
          {currentStep === 1 ? (
            <StepOne
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              color={color}
              setColor={setColor}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              projects={projects || []}
              isLoadingProjects={isLoadingProjects}
              isCreatingProject={isCreatingProject}
              setIsCreatingProject={setIsCreatingProject}
              handleProjectCreated={handleProjectCreated}
              waitingForProjectRefresh={waitingForProjectRefresh}
              projectJustCreated={projectJustCreated}
            />
          ) : (
            <StepTwo
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedAgentIds={selectedAgentIds}
              toggleAgentSelection={toggleAgentSelection}
              showAllAgents={showAllAgents}
              setShowAllAgents={setShowAllAgents}
            />
          )}
        </div>
        
        <div className="border-t p-4">
          <CreateRoomFooter
            currentStep={currentStep}
            onBack={() => setCurrentStep(1)}
            onNext={() => currentStep === 1 ? setCurrentStep(2) : handleSubmit()}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading || waitingForProjectRefresh}
            nextDisabled={isNextDisabled}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
