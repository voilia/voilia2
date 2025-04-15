
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectDescriptionEditorProps {
  project: {
    id: string;
    description: string | null;
  };
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export function ProjectDescriptionEditor({ project, isEditing, setIsEditing }: ProjectDescriptionEditorProps) {
  const [description, setDescription] = useState(project?.description || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();
  
  const isLongDescription = project?.description && project.description.length > 120;

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
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating project description:", error);
      toast.error("Failed to update project description");
    }
  };

  return (
    <div>
      {isEditing ? (
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
          onClick={() => setIsEditing(true)}
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
  );
}
