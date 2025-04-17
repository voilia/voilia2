
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

      // Get projects the user is a member of (including those they own)
      const { data: memberProjects, error: memberError } = await supabase
        .from("project_members")
        .select(`
          project_id,
          projects (
            id,
            name,
            description,
            color,
            owner_id,
            created_at,
            updated_at,
            is_personal,
            is_deleted
          )
        `)
        .eq("user_id", user.id)
        .eq("projects.is_deleted", false);

      if (memberError) {
        console.error("Error fetching project memberships:", memberError);
        throw memberError;
      }
      
      // Transform the data structure to match the Project type
      const projectsData = memberProjects
        ?.filter(item => item.projects !== null)
        .map(item => item.projects) as Project[] || [];
      
      // Sort projects by updated_at in memory (client-side)
      projectsData.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
        const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
      
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
