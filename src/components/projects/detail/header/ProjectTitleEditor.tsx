
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectIcon } from "./components/ProjectIcon";
import { InlineEditInput } from "./components/InlineEditInput";

interface ProjectTitleEditorProps {
  project: {
    id: string;
    name: string;
    color?: string;
  };
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export function ProjectTitleEditor({ project, isEditing, setIsEditing }: ProjectTitleEditorProps) {
  const queryClient = useQueryClient();

  const handleNameSubmit = async (name: string) => {
    if (!project) return;
    
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

  return (
    <div className="flex items-center gap-3">
      <ProjectIcon color={project?.color} />
      {isEditing ? (
        <InlineEditInput
          value={project?.name || ""}
          onSubmit={handleNameSubmit}
          className="text-2xl font-bold"
          placeholder="Enter project name"
          isEditing={isEditing}
          onEditEnd={() => setIsEditing(false)}
        />
      ) : (
        <h1 
          className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
          onClick={() => setIsEditing(true)}
        >
          {project?.name}
        </h1>
      )}
    </div>
  );
}
