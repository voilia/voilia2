
import { useState, useEffect } from "react";
import { ProjectColor, projectColors } from "@/components/projects/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useCreateRoom(initialProjectId?: string) {
  const navigate = useNavigate();
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
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    }
  }, [initialProjectId]);

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
    setSelectedProjectId(newProjectId);
    setIsCreatingProject(false);
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
      
      // Instead of using the RPC function that relies on project_room_members,
      // we'll insert directly into the rooms table
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
      
      // Now add the selected agents to the room_agents table if any were selected
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
