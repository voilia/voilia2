
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomMessage } from "@/types/room-messages";
import { toast } from "sonner";

export function useMessagesFetcher(roomId: string | undefined) {
  const fetchMessages = useCallback(async () => {
    if (!roomId) return [];

    try {
      console.log("Fetching messages for room:", roomId);
      
      const { data, error } = await supabase
        .from("room_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) throw error;
        
      return (data || []).map(msg => ({
        ...msg,
        transaction_id: msg.transaction_id || `db-${msg.id}`,
        messageType: msg.user_id === null ? 'agent' as const : 'user' as const,
        isPending: false
      }));
      
    } catch (err) {
      console.error("Error fetching room messages:", err);
      toast.error("Failed to load messages");
      throw err;
    }
  }, [roomId]);

  return { fetchMessages };
}
