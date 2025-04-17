
import { useState, useEffect } from "react";
import { ProjectColor } from "@/components/projects/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useCreateRoom(initialProjectId?: string) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<ProjectColor>("indigo");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllAgents, setShowAllAgents] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal closes or opens with initialProjectId
  const resetForm = () => {
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
  };

  // Handle project creation completion
  const handleProjectCreated = (newProjectId: string) => {
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
      const colorHex = projectColors[color];
      
      const { data, error } = await supabase.rpc('create_room_with_agents', {
        _project_id: selectedProjectId,
        _name: name.trim(),
        _description: description.trim() || null,
        _color: colorHex,
        _agent_ids: selectedAgentIds
      });
      
      if (error) throw error;
      
      toast.success("Room created successfully!");
      
      if (data) {
        navigate(`/rooms/${data}`);
      }
      
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
