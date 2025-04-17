import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorSwatch } from "@/components/projects/ColorSwatch";
import { ProjectColor } from "@/components/projects/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft } from "lucide-react";

interface CreateProjectInlineProps {
  onProjectCreated: (projectId: string) => void;
  onCancel: () => void;
}

export function CreateProjectInline({ onProjectCreated, onCancel }: CreateProjectInlineProps) {
  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState<ProjectColor>("indigo");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be signed in to create a project");
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: projectName.trim(),
          owner_id: user.id,
          color: selectedColor
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Project created successfully!");
      
      if (data && data.id) {
        onProjectCreated(data.id);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">Create New Project</h3>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name*</Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project-color">Color</Label>
          <ColorSwatch 
            id="project-color"
            value={selectedColor} 
            onChange={setSelectedColor} 
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreateProject} disabled={isLoading}>
            {isLoading ? <Loader size="sm" className="mr-2" /> : null}
            Create Project
          </Button>
        </div>
      </div>
    </div>
  );
}
