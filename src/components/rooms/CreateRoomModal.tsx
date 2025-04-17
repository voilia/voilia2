
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectColors, ProjectColor, Project } from "@/components/projects/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { supabase } from "@/integrations/supabase/client";
import { useAgents } from "@/hooks/useAgents";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepOne } from "./create/StepOne";
import { StepTwo } from "./create/StepTwo";
import { cn } from "@/lib/utils";

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
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<ProjectColor>("indigo");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllAgents, setShowAllAgents] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  
  // Get agents from the hook
  const { agents: allAgents, isLoading: isLoadingAgents } = useAgents();
  
  // Filter public agents only
  const publicAgents = useMemo(() => {
    return allAgents?.filter(agent => agent.isPublic) || [];
  }, [allAgents]);
  
  // Filter agents by search query
  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return publicAgents;
    
    const lowerQuery = searchQuery.toLowerCase();
    return publicAgents.filter(agent => 
      agent.name.toLowerCase().includes(lowerQuery) || 
      agent.description.toLowerCase().includes(lowerQuery)
    );
  }, [publicAgents, searchQuery]);

  // Get visible agents (limited unless show all is clicked)
  const visibleAgents = useMemo(() => {
    return showAllAgents ? filteredAgents : filteredAgents.slice(0, 6);
  }, [filteredAgents, showAllAgents]);
  
  // Get selected project
  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);
  
  // Set default color based on selected project
  useEffect(() => {
    if (selectedProject?.color) {
      // Find the closest color in our palette or default to indigo
      const projectColorHex = selectedProject.color;
      const closestColor = Object.entries(projectColors).reduce((closest, [colorName, colorHex]) => {
        if (colorHex === projectColorHex) {
          return colorName as ProjectColor;
        }
        return closest;
      }, "indigo" as ProjectColor);
      
      setColor(closestColor);
    }
  }, [selectedProject]);
  
  // Reset form when modal closes or opens with initialProjectId
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setColor("indigo");
      setSelectedAgentIds([]);
      setCurrentStep(1);
      setSearchQuery("");
      setShowAllAgents(false);
      if (!initialProjectId) {
        setSelectedProjectId(null);
      }
      setIsCreatingProject(false);
    } else if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    }
  }, [isOpen, initialProjectId]);
  
  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoadingProjects(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("owner_id", user.id)
          .eq("is_deleted", false)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        
        setProjects(data);
        
        // If we have projects and no project is selected, select the first one
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
  
  // Toggle agent selection
  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgentIds(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };
  
  // Handle new project creation completion
  const handleProjectCreated = (newProjectId: string) => {
    const fetchProjects = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("owner_id", user.id)
          .eq("is_deleted", false)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    
    fetchProjects();
    setSelectedProjectId(newProjectId);
    setIsCreatingProject(false);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!selectedProjectId) {
        toast.error("Please select a project");
        setCurrentStep(1);
        return;
      }
      
      if (!name.trim()) {
        toast.error("Room name is required");
        setCurrentStep(1);
        return;
      }
      
      setIsLoading(true);
      
      // Get the hex color value
      const colorHex = projectColors[color];
      
      // Use the second overloaded function that has parameters in the correct order
      const { data, error } = await supabase.rpc('create_room_with_agents', {
        _project_id: selectedProjectId,
        _name: name.trim(),
        _description: description.trim() || null,
        _color: colorHex,
        _agent_ids: selectedAgentIds
      });
      
      if (error) throw error;
      
      toast.success("Room created successfully!");
      onOpenChange(false);
      
      // Navigate to the new room
      if (data) {
        navigate(`/rooms/${data}`);
      }
      
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render the step indicator
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-2 mt-2 mb-4">
        <div 
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-colors",
            currentStep === 1 ? "bg-primary" : "bg-muted"
          )}
        />
        <div 
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-colors",
            currentStep === 2 ? "bg-primary" : "bg-muted"
          )}
        />
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-6 rounded-xl">
        <DialogHeader className="pb-4 border-b mb-4">
          <DialogTitle className="text-2xl font-bold">Create New Room</DialogTitle>
          <DialogDescription className="text-base mt-1">
            Create a collaborative space with AI agents
          </DialogDescription>
          {renderStepIndicator()}
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
          {currentStep === 1 ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
                Cancel
              </Button>
              <Button onClick={() => setCurrentStep(2)} className="px-6">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="px-6">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="px-6">
                {isLoading ? <Loader size="sm" className="mr-2" /> : null}
                Create Room
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
