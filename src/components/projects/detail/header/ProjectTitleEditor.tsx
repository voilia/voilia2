
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Folder } from "lucide-react";

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
  const [name, setName] = useState(project?.name || "");
  const queryClient = useQueryClient();

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

  const iconStyles = {
    backgroundColor: `${project?.color || '#8E9196'}20`,
    color: project?.color || '#8E9196',
  };

  return (
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
  );
}
