
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

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Get projects where user is owner
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("owner_id", user.id)
          .eq("is_deleted", false)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        
        setProjects(data as Project[]);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err as Error);
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [location.key]); // Refetch when location key changes (on navigation)

  return { projects, isLoading, error };
}
