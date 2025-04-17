
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

        // Get projects where user is a member (including those they own)
        const { data: memberProjects, error: memberError } = await supabase
          .from("project_members")
          .select(`
            project_id,
            projects (
              id,
              name
            )
          `)
          .eq("user_id", user.id)
          .eq("projects.is_deleted", false);
        
        if (memberError) {
          console.error("Error fetching project memberships for sidebar:", memberError);
          setProjects([]);
          return;
        }
        
        // Transform the data structure
        const projectsData = memberProjects
          ?.filter(item => item.projects !== null)
          .map(item => ({
            id: item.projects.id,
            name: item.projects.name
          })) as Project[] || [];
        
        // Sort projects in memory
        projectsData.sort((a, b) => a.name.localeCompare(b.name));
        
        // Only show top 5
        setProjects(projectsData.slice(0, 5));
      } catch (err) {
        console.error("Error fetching projects for sidebar:", err);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProjects();
  }, []);

  return { projects, isLoading };
}
