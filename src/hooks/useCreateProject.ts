
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreateProjectFormValues, createProjectSchema, projectColors, ProjectColor } from "@/components/projects/types";
import { useAuth } from "@/components/auth/AuthProvider";

export function useCreateProject(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "violet"
    }
  });

  const onSubmit = async (values: CreateProjectFormValues) => {
    if (isSubmitting) return;
    
    if (!user) {
      toast.error("You must be logged in to create a project");
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Creating project:", values.name);
      
      // Convert color key to hex value
      const colorValue = projectColors[values.color as ProjectColor] || values.color;

      // First, check if a project with this name already exists
      const { data: existingProjects, error: checkError } = await supabase
        .from("projects")
        .select("id")
        .eq("name", values.name)
        .eq("owner_id", user.id)
        .eq("is_deleted", false)
        .limit(1);
      
      if (checkError) {
        console.error("Error checking for existing project:", checkError);
        throw checkError;
      }
      
      // If project already exists, navigate to it
      if (existingProjects && existingProjects.length > 0) {
        console.log("Project already exists, navigating to it:", existingProjects[0].id);
        toast.info("A project with this name already exists");
        
        if (onSuccess) onSuccess();
        navigate(`/projects/${existingProjects[0].id}`, { replace: true });
        return;
      }

      // Create project using the RPC function
      const { data: projectId, error } = await supabase.rpc('create_project_with_owner', {
        _name: values.name,
        _description: values.description || null,
        _color: colorValue
      });
      
      if (error) {
        // Handle the specific 409 conflict error for duplicate projects
        if (error.code === '23505' || error.code === '409') {
          console.log("Duplicate project detected after creation attempt, fetching existing project");
          
          // Delay slightly to allow for potential database consistency issues
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Try to find the existing project with this name
          const { data: conflictedProjects, error: findError } = await supabase
            .from("projects")
            .select("id")
            .eq("name", values.name)
            .eq("owner_id", user.id)
            .eq("is_deleted", false)
            .limit(1);
          
          if (findError) {
            console.error("Error finding conflicted project:", findError);
            throw findError;
          }
          
          if (conflictedProjects && conflictedProjects.length > 0) {
            console.log("Found conflicted project:", conflictedProjects[0].id);
            toast.success("Navigating to your existing project");
            
            if (onSuccess) onSuccess();
            navigate(`/projects/${conflictedProjects[0].id}`, { replace: true });
            return;
          } else {
            // Force a refresh of the projects page as a fallback
            console.log("Could not find conflicted project, refreshing projects page");
            toast.info("Please check your projects list");
            
            if (onSuccess) onSuccess();
            navigate("/projects", { replace: true, state: { refresh: true } });
            return;
          }
        }
        
        console.error("Project creation error:", error);
        throw error;
      }

      if (!projectId) {
        throw new Error("Failed to create project: No project ID returned");
      }

      console.log("Project created successfully:", projectId);
      toast.success("Project created successfully");
      
      // Call the onSuccess callback to close the modal
      if (onSuccess) {
        onSuccess();
      }
      
      // Navigate to the new project
      navigate(`/projects/${projectId}`, { replace: true });
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(`Failed to create project: ${error.message || "Please try again"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit
  };
}
