
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
}

export function useRooms(projectId: string) {
  return useQuery({
    queryKey: ["rooms", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("project_id", projectId)
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Room[];
    },
  });
}
