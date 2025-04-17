
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorSwatch } from "@/components/projects/ColorSwatch";
import { ProjectColor, projectColors } from "@/components/projects/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface CreateProjectInlineProps {
  onProjectCreated: (projectId: string) => void;
  onCancel: () => void;
}

export function CreateProjectInline({ onProjectCreated, onCancel }: CreateProjectInlineProps) {
  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState<ProjectColor>("indigo");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!user) {
      toast.error("You must be signed in to create a project");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Creating project:", projectName);

      // First, check if a project with this name already exists
      const { data: existingProjects, error: checkError } = await supabase
        .from("projects")
        .select("id")
        .eq("name", projectName.trim())
        .eq("owner_id", user.id)
        .eq("is_deleted", false)
        .limit(1);
      
      if (checkError) {
        console.error("Error checking for existing project:", checkError);
        throw checkError;
      }
      
      // If project already exists, use it
      if (existingProjects && existingProjects.length > 0) {
        console.log("Project already exists, using it:", existingProjects[0].id);
        toast.info("A project with this name already exists");
        onProjectCreated(existingProjects[0].id);
        return;
      }

      // Get the color hex value
      const colorValue = projectColors[selectedColor];

      // Create project using the RPC function
      const { data, error } = await supabase.rpc('create_project_with_owner', {
        _name: projectName.trim(),
        _description: null,
        _color: colorValue
      });

      if (error) {
        // If it's a unique constraint violation or other conflict error
        if (error.code === '23505' || error.code === '409') {
          // Wait a moment to allow for database consistency
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Try to find the project that may have been created
          const { data: latestProject, error: findError } = await supabase
            .from("projects")
            .select("id")
            .eq("name", projectName.trim())
            .eq("owner_id", user.id)
            .eq("is_deleted", false)
            .order("created_at", { ascending: false })
            .limit(1);
            
          if (findError) {
            console.error("Error finding latest project:", findError);
            throw findError;
          }
          
          if (latestProject && latestProject.length > 0) {
            console.log("Found project after conflict:", latestProject[0].id);
            toast.success("Project created");
            onProjectCreated(latestProject[0].id);
            return;
          }
          
          throw new Error("Could not create project: Name may be already in use");
        }
        
        console.error("Project creation error:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Failed to create project: No project ID returned");
      }

      console.log("Project created successfully:", data);
      toast.success("Project created successfully");
      
      onProjectCreated(data as string);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(`Failed to create project: ${error.message || "Please try again"}`);
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
