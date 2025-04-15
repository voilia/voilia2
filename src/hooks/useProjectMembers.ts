
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Member {
  id: string;
  project_id: string;
  user_id: string;
  role: "owner" | "admin" | "member" | "viewer";
  joined_at: string;
  user_name?: string;
  user_email?: string;
}

export function useProjectMembers(projectId: string) {
  const { data: members, isLoading, refetch } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_members")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      
      return data.map((member: any) => ({
        ...member,
        user_name: member.role === "owner" ? "Project Owner" : `Team Member ${member.id.substring(0, 4)}`,
        user_email: `user-${member.id.substring(0, 4)}@example.com`,
      })) as Member[];
    },
  });

  return { members, isLoading, refetch };
}
