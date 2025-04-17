
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Room {
  id: string;
  name: string;
  description: string | null;
  project_id: string;
  created_at: string;
  updated_at: string;
  project?: {
    name: string;
    color: string;
  };
}

export function useRooms(projectId: string) {
  return useQuery({
    queryKey: ["rooms", projectId],
    queryFn: async () => {
      try {
        let query = supabase
          .from("rooms")
          .select("*, projects(name, color)")
          .eq("is_archived", false)
          .order("updated_at", { ascending: false });
        
        // If not "all", filter by project_id
        if (projectId !== "all") {
          query = query.eq("project_id", projectId);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        return data as Room[];
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast.error("Failed to load rooms");
        return [];
      }
    },
    enabled: true,
  });
}
