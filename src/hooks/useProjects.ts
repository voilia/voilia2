
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/components/projects/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Simplified query to only fetch projects where the user is the owner
        // This avoids the complex join that might cause RLS recursion
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("is_deleted", false)
          .or(`owner_id.eq.${user.id}`)
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
  }, []);

  return { projects, isLoading, error };
}
