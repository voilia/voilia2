
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
import { Check, Plus, X } from "lucide-react";
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
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<ProjectColor>("indigo");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  
  // Get agents from the hook
  const { agents, isLoading: isLoadingAgents } = useAgents();
  
  // Filter public agents only
  const publicAgents = useMemo(() => {
    return agents?.filter(agent => agent.isPublic) || [];
  }, [agents]);
  
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
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setColor("indigo");
      setSelectedAgentIds([]);
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
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!name.trim()) {
        toast.error("Room name is required");
        return;
      }
      
      if (!selectedProjectId) {
        toast.error("Please select a project");
        return;
      }
      
      let finalAgentIds = selectedAgentIds;
      
      if (selectedAgentIds.length === 0) {
        // Auto-add VOILIA ONE and a fallback LLM if available
        const voiliaOneAgent = publicAgents.find(a => 
          a.name.toLowerCase().includes("voilia one") || a.name.toLowerCase().includes("voilia")
        );
        
        const fallbackLLM = publicAgents.find(a => 
          a.type === "llm"
        );
        
        const defaultAgents = [
          ...(voiliaOneAgent ? [voiliaOneAgent.id] : []),
          ...(fallbackLLM && (!voiliaOneAgent || voiliaOneAgent.id !== fallbackLLM.id) ? [fallbackLLM.id] : [])
        ];
        
        if (defaultAgents.length > 0) {
          finalAgentIds = defaultAgents;
          setSelectedAgentIds(defaultAgents);
        } else {
          toast.error("Please select at least one agent");
          return;
        }
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
        _agent_ids: finalAgentIds
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Create a collaborative space with AI agents
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="pr-4 h-[calc(80vh-180px)]">
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
              
              {/* Select Agents */}
              <div className="space-y-4">
                <Label>Select Agents*</Label>
                {isLoadingAgents ? (
                  <div className="flex items-center justify-center p-6">
                    <Loader />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {publicAgents.map((agent) => (
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
              
              {/* Add Members */}
              <div className="space-y-2 opacity-60">
                <Label className="flex items-center gap-2" htmlFor="members">
                  Add Members
                  <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                </Label>
                <div className="p-3 border rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  You'll be able to invite members after Room creation
                </div>
              </div>
              
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loader size="sm" className="mr-2" /> : null}
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
