
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
        navigate(`/projects/${existingProjects[0].id}`);
        return;
      }

      // Create project using the RPC function
      const { data: projectId, error } = await supabase.rpc('create_project_with_owner', {
        _name: values.name,
        _description: values.description || null,
        _color: colorValue
      });
      
      if (error) {
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
      
      // Navigate to the new project (without replace:true to allow going back)
      navigate(`/projects/${projectId}`);
    } catch (error: any) {
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
