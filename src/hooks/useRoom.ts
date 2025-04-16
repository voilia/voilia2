
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Room } from "@/hooks/useRooms";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function useRoom(roomId: string | undefined) {
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      if (!roomId) {
        throw new Error("Room ID is required");
      }
      
      try {
        // First check if room exists and is not archived
        const { data: roomExists, error: checkError } = await supabase
          .from("rooms")
          .select("id")
          .eq("id", roomId)
          .eq("is_archived", false)
          .single();
          
        if (checkError || !roomExists) {
          throw new Error("Room not found or has been archived");
        }
        
        // Now fetch full room details
        const { data, error } = await supabase
          .from("rooms")
          .select("*, projects(name, color)")
          .eq("id", roomId)
          .single();

        if (error) {
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
    refetchOnWindowFocus: false
  });
  
  // Handle navigation on error
  useEffect(() => {
    if (query.error) {
      toast.error("Room not found or cannot be accessed");
      
      // Navigate back to projects after a short delay
      const timer = setTimeout(() => {
        navigate("/projects");
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [query.error, navigate]);
  
  return query;
}
