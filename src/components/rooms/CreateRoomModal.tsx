
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ColorSwatch } from "@/components/projects/ColorSwatch";
import { ProjectColor, projectColors } from "@/components/projects/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { supabase } from "@/integrations/supabase/client";
import { useAgents } from "@/hooks/useAgents";
import { useMemo } from "react";
import { Agent } from "@/components/agents/types";
import { Check, ChevronLeft, ChevronRight, Filter, Plus, Search, X } from "lucide-react";
import { Project } from "@/components/projects/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateProjectInline } from "@/components/projects/CreateProjectInline";
import { Badge } from "@/components/ui/badge";
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
        
        setProjects(data as Project[]);
        
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
  
  // Validate step 1
  const validateStep1 = () => {
    if (!name.trim()) {
      toast.error("Room name is required");
      return false;
    }
    
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return false;
    }
    
    return true;
  };
  
  // Move to next step
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };
  
  // Move to previous step
  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!validateStep1()) {
        setCurrentStep(1);
        return;
      }
      
      setIsLoading(true);
      
      // Get the hex color value
      const colorHex = projectColors[color];
      
      // Call the RPC function
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
      if (data && data[0] && data[0].room_id) {
        navigate(`/rooms/${data[0].room_id}`);
      }
      
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle new project creation completion
  const handleProjectCreated = (newProjectId: string) => {
    // Refresh projects list
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
        
        setProjects(data as Project[]);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    
    fetchProjects();
    
    // Select the new project
    setSelectedProjectId(newProjectId);
    setIsCreatingProject(false);
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
  
  // Render step 1 content
  const renderStep1 = () => {
    return (
      <div className="space-y-5 py-4">
        {/* Project Selection */}
        <div className="space-y-2">
          <Label htmlFor="project">Project*</Label>
          {isCreatingProject ? (
            <div className="space-y-4">
              <CreateProjectInline 
                onProjectCreated={handleProjectCreated}
                onCancel={() => setIsCreatingProject(false)}
              />
            </div>
          ) : (
            <>
              <Select
                value={selectedProjectId || undefined}
                onValueChange={(value) => {
                  if (value === "create-new") {
                    setIsCreatingProject(true);
                  } else {
                    setSelectedProjectId(value);
                  }
                }}
                disabled={isLoadingProjects}
              >
                <SelectTrigger>
                  {isLoadingProjects ? (
                    <div className="flex items-center gap-2">
                      <Loader size="sm" />
                      <span>Loading projects...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select a project" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: project.color }}
                        />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="create-new">
                    <div className="flex items-center text-primary gap-2">
                      <Plus className="h-3.5 w-3.5" />
                      Create New Project
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        
        {/* Room Name */}
        <div className="space-y-2">
          <Label htmlFor="room-name">Room Name*</Label>
          <Input
            id="room-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter room name"
          />
        </div>
        
        {/* Room Description */}
        <div className="space-y-2">
          <Label htmlFor="room-description">Description (optional)</Label>
          <Textarea
            id="room-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose of this room"
            rows={3}
          />
        </div>
        
        {/* Room Color */}
        <div className="space-y-2">
          <Label htmlFor="room-color">Room Color</Label>
          <ColorSwatch
            id="room-color"
            value={color}
            onChange={setColor}
          />
        </div>
      </div>
    );
  };
  
  // Render step 2 content
  const renderStep2 = () => {
    return (
      <div className="space-y-5 py-4">
        {/* Add Members (Coming Soon) */}
        <div className="space-y-2 opacity-60">
          <Label className="flex items-center gap-2" htmlFor="members">
            Add Members
            <Badge variant="outline" className="text-xs">Coming Soon</Badge>
          </Label>
          <div className="p-3 border rounded-lg bg-muted/50 text-sm text-muted-foreground">
            You'll be able to invite collaborators after Room creation
          </div>
        </div>
        
        {/* Select Agents */}
        <div className="space-y-4">
          <Label>Select Agents (optional)</Label>
          
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAllAgents(true);
              }}
            />
          </div>
          
          {isLoadingAgents ? (
            <div className="flex items-center justify-center p-6">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {visibleAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className={cn(
                      "border rounded-lg p-3 cursor-pointer transition-all",
                      selectedAgentIds.includes(agent.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => toggleAgentSelection(agent.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className={cn(
                          "rounded-full p-2 shrink-0",
                          selectedAgentIds.includes(agent.id) 
                            ? "bg-primary/20 text-primary" 
                            : "bg-muted"
                        )}
                        style={{ 
                          ...(agent.color && selectedAgentIds.includes(agent.id) 
                            ? { 
                              backgroundColor: `${agent.color}20`,
                              color: agent.color 
                            } 
                            : {})
                        }}
                      >
                        {selectedAgentIds.includes(agent.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          agent.icon && <agent.icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{agent.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show more button */}
              {!showAllAgents && filteredAgents.length > 6 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setShowAllAgents(true)}
                >
                  Show All Agents ({filteredAgents.length})
                </Button>
              )}
              
              {/* Selected agents pills */}
              {selectedAgentIds.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Selected ({selectedAgentIds.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgentIds.map(id => {
                      const agent = publicAgents.find(a => a.id === id);
                      return agent && (
                        <Badge 
                          key={id} 
                          variant="outline"
                          className="flex items-center gap-1 pr-1"
                        >
                          <span>{agent.name}</span>
                          <button
                            className="hover:bg-accent rounded-full p-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAgentSelection(id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Empty state for no matching agents */}
              {filteredAgents.length === 0 && (
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg text-center space-y-2">
                  <Filter className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium">No agents found</p>
                    <p className="text-sm text-muted-foreground">Try a different search term</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Coming Soon Features */}
        {/* Blueprint Selection */}
        <div className="space-y-2 opacity-60">
          <Label className="flex items-center gap-2" htmlFor="blueprint">
            Start from Blueprint
            <Badge variant="outline" className="text-xs">Coming Soon</Badge>
          </Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Choose a blueprint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled">Choose a blueprint</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Create a collaborative space with AI agents
          </DialogDescription>
          {renderStepIndicator()}
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="pr-4 h-[calc(80vh-180px)]">
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex flex-row justify-between sm:justify-between gap-2">
          {currentStep === 1 ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNextStep}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
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
