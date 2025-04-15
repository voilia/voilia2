
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Share, Settings, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  color?: string;
}

interface ProjectDetailHeaderProps {
  project?: Project;
  isLoading: boolean;
}

export function ProjectDetailHeader({ project, isLoading }: ProjectDetailHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  // Handle name edit submission
  const handleNameSubmit = async () => {
    if (!project || !name.trim()) return;
    
    try {
      const { error } = await supabase
        .from("projects")
        .update({ name })
        .eq("id", project.id);
        
      if (error) throw error;
      
      toast.success("Project name updated");
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating project name:", error);
      toast.error("Failed to update project name");
    }
  };

  // Handle description edit submission
  const handleDescriptionSubmit = async () => {
    if (!project) return;
    
    try {
      const { error } = await supabase
        .from("projects")
        .update({ description })
        .eq("id", project.id);
        
      if (error) throw error;
      
      toast.success("Project description updated");
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
    } catch (error) {
      console.error("Error updating project description:", error);
      toast.error("Failed to update project description");
    }
  };

  // Check if description needs truncation
  const isLongDescription = project?.description && project.description.length > 120;
  const displayDescription = isLongDescription && !isExpanded
    ? `${project?.description?.substring(0, 120)}...`
    : project?.description;

  // Render skeleton loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <Skeleton className="h-10 w-3/4 max-w-md" />
        <Skeleton className="h-16 w-full max-w-2xl" />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Project Name */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold px-2 py-1 border rounded-md w-full max-w-xl focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onBlur={handleNameSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              />
              <Button
                size="sm"
                onClick={handleNameSubmit}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setName(project?.name || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <h1 
              className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {project?.name}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <Button size="sm" variant="outline" className="gap-1">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.info("Settings coming soon")}>
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Pin project</DropdownMenuItem>
              <DropdownMenuItem>Duplicate project</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Project Description */}
      <div>
        {project?.description ? (
          <div>
            <p className="text-muted-foreground">
              {displayDescription}
              {isLongDescription && (
                <button
                  className="ml-1 text-primary font-medium hover:underline"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </p>
          </div>
        ) : (
          <div 
            className="text-muted-foreground italic cursor-pointer hover:text-primary transition-colors"
            onClick={() => {
              setDescription("");
              setIsEditing(true);
            }}
          >
            Add a description...
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span>Owner</span>
        </div>
        <div className="h-4 w-[1px] bg-border" />
        <div>
          Created {project?.created_at ? format(new Date(project.created_at), "MMM d, yyyy") : ""}
        </div>
      </div>
    </div>
  );
}
