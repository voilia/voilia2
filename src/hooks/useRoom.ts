
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Room } from "@/hooks/useRooms";

export function useRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      if (!roomId) throw new Error("Room ID is required");
      
      const { data, error } = await supabase
        .from("rooms")
        .select("*, projects(name, color)")
        .eq("id", roomId)
        .single();

      if (error) {
        console.error("Error fetching room:", error);
        toast.error("Failed to load room details");
        throw error;
      }

      return data as Room & { projects: { name: string; color: string } };
    },
    enabled: !!roomId,
  });
}
