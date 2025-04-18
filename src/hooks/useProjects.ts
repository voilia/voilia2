
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/components/projects/types";
import { useLocation } from "react-router-dom";

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();
  const lastFetchTime = useRef<number>(0);
  const cacheTimeMs = 60000; // 1 minute cache

  const fetchProjects = useCallback(async (forceFetch = false) => {
    // Skip fetching if we've fetched recently unless force refresh
    const now = Date.now();
    if (!forceFetch && now - lastFetchTime.current < cacheTimeMs && projects) {
      console.log("Using cached projects data");
      return projects;
    }

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
      
      console.log(`Fetched ${projectsData.length} projects`);
      
      lastFetchTime.current = now;
      setProjects(projectsData);
      setIsLoading(false);
      return projectsData; // Return the projects for immediate use
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err as Error);
      toast.error("Failed to load projects");
      setIsLoading(false);
      return null;
    }
  }, [projects]);

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger, fetchProjects]); // Include fetchProjects in dependencies

  // Separate effect to handle location.state refresh
  useEffect(() => {
    if (location.state?.refresh) {
      console.log("Refresh triggered from navigation state");
      // Clear the state to prevent infinite refresh
      window.history.replaceState(null, "", location.pathname);
      setRefreshTrigger(prev => prev + 1);
    }
  }, [location.state?.refresh, location.pathname]);

  // Add a manual refresh function that can be called
  const refreshProjects = useCallback(() => {
    console.log("Manual refresh requested");
    setRefreshTrigger(prev => prev + 1);
    return fetchProjects(true); // Force refresh
  }, [fetchProjects]);

  return { projects, isLoading, error, refreshProjects, fetchProjects };
}
