
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
}

export function useProjectSidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProjects() {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setProjects([]);
          return;
        }

        const { data, error } = await supabase
          .from("projects")
          .select("id, name")
          .eq("owner_id", user.id)
          .eq("is_deleted", false)
          .order("updated_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects for sidebar:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProjects();
  }, []);

  return { projects, isLoading };
}
