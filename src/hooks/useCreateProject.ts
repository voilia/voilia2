
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreateProjectFormValues, createProjectSchema, projectColors, ProjectColor } from "@/components/projects/types";

export function useCreateProject(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "violet"
    }
  });

  const onSubmit = async (values: CreateProjectFormValues) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Convert color key to hex value
      const colorValue = projectColors[values.color as ProjectColor] || values.color;

      // Create the project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          description: values.description || null,
          color: colorValue,
          owner_id: user.id
        })
        .select()
        .single();

      if (projectError) {
        console.error("Project creation error:", projectError);
        throw projectError;
      }

      // Check if a membership record for this user and project already exists
      const { data: existingMember, error: checkError } = await supabase
        .from("project_members")
        .select()
        .eq("project_id", project.id)
        .eq("user_id", user.id)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.log("Error checking existing membership:", checkError);
        // Continue with creation if error is just "no rows returned"
      } else if (existingMember) {
        console.log("User is already a member of this project:", existingMember);
        // Skip creation of member record as it already exists
      } else {
        // Create project member record only if it doesn't exist
        const { error: memberError } = await supabase
          .from("project_members")
          .insert({
            project_id: project.id,
            user_id: user.id,
            role: "owner"
          });

        if (memberError) {
          console.error("Project member creation error:", memberError);
          // Only log the error but continue with success flow since project was created
        }
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
