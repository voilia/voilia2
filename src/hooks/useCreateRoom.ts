
import { useState, useEffect, useCallback } from "react";
import { ProjectColor, projectColors } from "@/components/projects/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";

export function useCreateRoom(initialProjectId?: string) {
  const navigate = useNavigate();
  const { projects, refreshProjects, fetchProjects } = useProjects();
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
  const [projectJustCreated, setProjectJustCreated] = useState<string | null>(null);
  const [waitingForProjectRefresh, setWaitingForProjectRefresh] = useState(false);

  // Effect to handle color sync with selected project
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

  // Effect to check if we need to fetch projects again to get the newly created project
  useEffect(() => {
    const checkAndUpdateSelectedProject = async () => {
      if (projectJustCreated && waitingForProjectRefresh) {
        console.log("Checking for newly created project:", projectJustCreated);
        
        try {
          // Specifically fetch projects to ensure we have the latest data
          const latestProjects = await fetchProjects();
          
          if (latestProjects) {
            // Check if the newly created project is now in the projects list
            const projectExists = latestProjects.some(p => p.id === projectJustCreated);
            
            if (projectExists) {
              console.log("Found newly created project in fetched list:", projectJustCreated);
              // Project is now in the list, set it as selected and clear waiting states
              setSelectedProjectId(projectJustCreated);
              setProjectJustCreated(null);
              setWaitingForProjectRefresh(false);
            } else {
              console.log("Project still not in list, will try again");
              // If it's not in the list yet, schedule another refresh
              setTimeout(() => refreshProjects(), 1000); // Increased timeout for better chances
            }
          }
        } catch (error) {
          console.error("Error refreshing projects:", error);
          // Still try again after a timeout
          setTimeout(() => refreshProjects(), 1000);
        }
      }
    };
    
    checkAndUpdateSelectedProject();
  }, [projectJustCreated, waitingForProjectRefresh, fetchProjects, refreshProjects]);

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
    setProjectJustCreated(null);
    setWaitingForProjectRefresh(false);
  };

  const handleProjectCreated = useCallback(async (newProjectId: string) => {
    console.log("Project created with ID:", newProjectId);
    
    // Set the selected project ID immediately
    setSelectedProjectId(newProjectId);
    
    // Close the project creation form
    setIsCreatingProject(false);
    
    // Mark that we're waiting for this project to appear in the projects list
    setProjectJustCreated(newProjectId);
    setWaitingForProjectRefresh(true);
    
    // Immediately refresh projects list to include the new project
    try {
      await refreshProjects();
      
      // Even after refresh, sometimes the project might not be immediately visible
      // due to Supabase caching or delay, so we'll set multiple fallback retries
      const retryIntervals = [500, 1000, 2000, 3000];
      
      for (const interval of retryIntervals) {
        setTimeout(async () => {
          console.log(`Retrying project refresh after ${interval}ms`);
          const latestProjects = await refreshProjects();
          
          if (latestProjects && latestProjects.some(p => p.id === newProjectId)) {
            console.log(`Found project after ${interval}ms retry`);
            setWaitingForProjectRefresh(false);
          }
        }, interval);
      }
    } catch (error) {
      console.error("Error in initial project refresh:", error);
    }
  }, [refreshProjects]);
  
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
    resetForm,
    projectJustCreated,
    waitingForProjectRefresh
  };
}
