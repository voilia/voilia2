
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/components/projects/types";
import { useLocation } from "react-router-dom";

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const location = useLocation();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Fetching projects for user:", user.id);

      // Get projects where user is a member (including owner)
      const { data, error } = await supabase
        .from("project_members")
        .select("project_id, projects(*)")
        .eq("user_id", user.id)
        .eq("projects.is_deleted", false)
        .order("projects.updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }
      
      // Transform the data structure to match the Project type
      const projectsData = data?.map(item => item.projects) as Project[] || [];
      console.log(`Fetched ${projectsData.length || 0} projects`);
      
      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err as Error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [location.key]); // Refetch when location changes

  // Add a manual refresh function that can be called
  const refreshProjects = async () => {
    await fetchProjects();
  };

  return { projects, isLoading, error, refreshProjects };
}
