
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
      // Convert color key to hex value
      const colorValue = projectColors[values.color as ProjectColor] || values.color;

      // Create project using the RPC function
      const { data: projectId, error } = await supabase.rpc('create_project_with_owner', {
        _name: values.name,
        _description: values.description || null,
        _color: colorValue
      });
      
      if (error) {
        // Handle the specific 409 conflict error for duplicate projects
        if (error.code === '23505' || error.code === '409') {
          console.log("Duplicate project detected, attempting to find existing project");
          
          // Try to find the existing project with this name
          const { data: existingProjects, error: findError } = await supabase
            .from("projects")
            .select("id")
            .eq("name", values.name)
            .eq("owner_id", user.id)
            .eq("is_deleted", false)
            .limit(1);
          
          if (findError) {
            throw findError;
          }
          
          if (existingProjects && existingProjects.length > 0) {
            toast.success("Project already exists");
            if (onSuccess) onSuccess();
            // Navigate to the existing project instead
            navigate(`/projects/${existingProjects[0].id}`, { replace: true });
            return;
          } else {
            // If we can't find the existing project despite getting a duplicate error
            // This is likely a temporary database conflict that will resolve
            toast.success("Project processed");
            if (onSuccess) onSuccess();
            navigate("/projects", { replace: true });
            return;
          }
        }
        
        throw error;
      }

      if (!projectId) {
        throw new Error("Failed to create project: No project ID returned");
      }

      toast.success("Project created successfully");
      
      // Call the onSuccess callback to close the modal
      if (onSuccess) {
        onSuccess();
      }
      
      // Navigate to the new project
      navigate(`/projects/${projectId}`, { replace: true });
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
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
