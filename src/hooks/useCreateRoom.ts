
import { useState, useEffect } from "react";
import { ProjectColor, projectColors } from "@/components/projects/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";

export function useCreateRoom(initialProjectId?: string) {
  const navigate = useNavigate();
  const { projects, refreshProjects } = useProjects();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<ProjectColor>("violet");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllAgents, setShowAllAgents] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedProjectId && projects) {
      const selectedProject = projects.find(p => p.id === selectedProjectId);
      if (selectedProject?.color) {
        const colorKey = Object.entries(projectColors).find(
          ([_, value]) => value === selectedProject.color
        )?.[0] as ProjectColor;
        
        if (colorKey) {
          setColor(colorKey);
        }
      }
    }
  }, [selectedProjectId, projects]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor("violet");
    setSelectedAgentIds([]);
    setCurrentStep(1);
    setSearchQuery("");
    setShowAllAgents(false);
    if (!initialProjectId) {
      setSelectedProjectId(null);
    }
    setIsCreatingProject(false);
  };

  const handleProjectCreated = (newProjectId: string) => {
    // Set the selected project ID immediately
    setSelectedProjectId(newProjectId);
    // Close the project creation form
    setIsCreatingProject(false);
    // Refresh the projects list to include the new project
    refreshProjects();
  };
  
  const toggleAgentSelection = (id: string) => {
    setSelectedAgentIds(prev => 
      prev.includes(id) 
        ? prev.filter(agentId => agentId !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      if (!selectedProjectId) {
        toast.error("Please select a project");
        setCurrentStep(1);
        return false;
      }
      
      if (!name.trim()) {
        toast.error("Room name is required");
        setCurrentStep(1);
        return false;
      }
      
      setIsLoading(true);
      
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .insert({
          project_id: selectedProjectId,
          name: name.trim(),
          description: description.trim() || null,
          color: projectColors[color]
        })
        .select('id')
        .single();
      
      if (roomError) throw roomError;
      
      if (!roomData) {
        throw new Error("Failed to create room");
      }
      
      if (selectedAgentIds.length > 0) {
        const agentInserts = selectedAgentIds.map(agentId => ({
          room_id: roomData.id,
          agent_id: agentId,
          is_visible: true,
          execution_order: 0
        }));
        
        const { error: agentsError } = await supabase
          .from('room_agents')
          .insert(agentInserts);
        
        if (agentsError) {
          console.error("Error adding agents to room:", agentsError);
          // Continue anyway since the room was created
        }
      }
      
      toast.success("Room created successfully!");
      
      navigate(`/rooms/${roomData.id}`);
      
      return true;
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    resetForm
  };
}
