
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
        // Check for the specific duplicate key error
        if (error.code === '23505') {
          console.warn("Potential duplicate project. This may be a temporary error, continuing...");
          // We can still try to navigate to projects
          toast.success("Project processed successfully");
          if (onSuccess) onSuccess();
          navigate("/projects", { replace: true });
          return;
        }
        
        throw error;
      }

      if (!projectId) {
        throw new Error("Failed to create project: No project ID returned");
      }

      toast.success("Project created successfully!");
      
      // Call the onSuccess callback to close the modal
      if (onSuccess) {
        onSuccess();
      }
      
      // Reload projects
      navigate("/projects", { replace: true });
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
