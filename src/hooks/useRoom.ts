
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Room } from "@/hooks/useRooms";

export function useRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      if (!roomId) {
        throw new Error("Room ID is required");
      }
      
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("*, projects(name, color)")
          .eq("id", roomId)
          .single();

        if (error) {
          console.error("Error fetching room:", error);
          throw error;
        }

        if (!data) {
          throw new Error("Room not found");
        }

        return data as Room & { projects: { name: string; color: string } };
      } catch (error) {
        console.error("Error fetching room:", error);
        throw error;
      }
    },
    enabled: !!roomId && roomId !== ":id",
    retry: 1,
    onError: (error) => {
      console.error("Error in useRoom hook:", error);
      toast.error("Failed to load room details");
    }
  });
}
