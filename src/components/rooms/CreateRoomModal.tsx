
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StepOne } from "./create/StepOne";
import { StepTwo } from "./create/StepTwo";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { StepIndicator } from "./create/navigation/StepIndicator";
import { CreateRoomFooter } from "./create/navigation/CreateRoomFooter";
import { Project } from "@/components/projects/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    setSelectedAgentIds,
    isCreatingProject,
    setIsCreatingProject,
    searchQuery,
    setSearchQuery,
    showAllAgents,
    setShowAllAgents,
    isLoading,
    handleSubmit,
    handleProjectCreated,
    resetForm
  } = useCreateRoom(initialProjectId);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  
  // Reset form when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  
  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("owner_id", user.id)
          .eq("is_deleted", false)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        setProjects(data);
        
        if (data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Failed to load projects");
      } finally {
        setIsLoadingProjects(false);
      }
    };

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen, selectedProjectId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-6 rounded-xl">
        <DialogHeader className="pb-4 border-b mb-4">
          <DialogTitle className="text-2xl font-bold">Create New Room</DialogTitle>
          <DialogDescription className="text-base mt-1">
            Create a collaborative space with AI agents
          </DialogDescription>
          <StepIndicator currentStep={currentStep} />
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="pr-4 h-[calc(60vh-140px)]">
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
                projects={projects}
                isLoadingProjects={isLoadingProjects}
                isCreatingProject={isCreatingProject}
                setIsCreatingProject={setIsCreatingProject}
                handleProjectCreated={handleProjectCreated}
              />
            ) : (
              <StepTwo
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                visibleAgents={visibleAgents}
                selectedAgentIds={selectedAgentIds}
                toggleAgentSelection={toggleAgentSelection}
                showAllAgents={showAllAgents}
                setShowAllAgents={setShowAllAgents}
                filteredAgents={filteredAgents}
                isLoadingAgents={isLoadingAgents}
                publicAgents={publicAgents}
              />
            )}
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex flex-row justify-between sm:justify-between gap-2 pt-4 border-t mt-4">
          <CreateRoomFooter
            currentStep={currentStep}
            onBack={() => setCurrentStep(1)}
            onNext={() => currentStep === 1 ? setCurrentStep(2) : handleSubmit()}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
