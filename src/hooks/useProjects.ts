
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

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .or(`owner_id.eq.${user.id},id.in.(select project_id from project_members where user_id = '${user.id}')`)
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
  }, []);

  return { projects, isLoading, error };
}
