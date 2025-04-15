import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Edit, Share, Settings, MoreHorizontal, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        setIsEditingDescription(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setName(project?.name || "");
    setDescription(project?.description || "");
  }, [project]);

  const iconStyles = {
    backgroundColor: `${project?.color || '#8E9196'}20`,
    color: project?.color || '#8E9196',
  };

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
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Error updating project description:", error);
      toast.error("Failed to update project description");
    }
  };

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

  const actions = (
    <>
      <Button size="sm" variant="outline" className="gap-1" onClick={() => setIsEditing(true)}>
        <Edit className="h-4 w-4" />
        <span className={isMobile ? "hidden" : "inline"}>Edit</span>
      </Button>
      <Button size="sm" variant="outline" className="gap-1">
        <Share className="h-4 w-4" />
        <span className={isMobile ? "hidden" : "inline"}>Share</span>
      </Button>
      {!isMobile && (
        <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.info("Settings coming soon")}>
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      )}
    </>
  );

  return (
    <div className="space-y-4" ref={editRef}>
      <div className="flex items-start justify-between flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className="rounded-full p-2 transition-colors hover:bg-[var(--hover-bg)]"
              style={{...iconStyles, '--hover-bg': `${project?.color || '#8E9196'}33`} as React.CSSProperties}
            >
              <Folder className="h-5 w-5" />
            </div>
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
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isMobile ? (
            <>
              <div className="flex-1 flex gap-2">{actions}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-9 w-9">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toast.info("Settings coming soon")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>

      <div>
        {isEditingDescription ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full max-w-2xl px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base min-h-[80px]"
              autoFocus
              onBlur={handleDescriptionSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) handleDescriptionSubmit();
              }}
              placeholder="Add a description..."
            />
            <p className="text-xs text-muted-foreground">
              Press ⌘ + Enter to save
            </p>
          </div>
        ) : (
          <div 
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={() => setIsEditingDescription(true)}
          >
            {project?.description ? (
              <p className="text-muted-foreground">
                {isLongDescription && !isExpanded
                  ? `${project.description.substring(0, 120)}...`
                  : project.description}
                {isLongDescription && (
                  <button
                    className="ml-1 text-primary font-medium hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </p>
            ) : (
              <p className="text-muted-foreground italic">
                Add a description...
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span>Owner</span>
        </div>
        <div className="hidden sm:block h-4 w-[1px] bg-border" />
        <div>
          Created {project?.created_at ? format(new Date(project.created_at), "MMM d, yyyy") : ""}
        </div>
      </div>
    </div>
  );
}
