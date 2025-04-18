
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RoomMessage } from "@/types/room-messages";

export const useRoomMessageSubscription = (
  roomId: string | undefined,
  onNewMessage: (message: RoomMessage) => void
) => {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!roomId) return;

    if (channelRef.current) {
      console.log("Removing existing channel for room:", roomId);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log("Setting up realtime subscription for room:", roomId);
    const channel = supabase
      .channel(`room_${roomId}_messages`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log("New message from realtime:", payload.new);
          const newMessage = {
            ...payload.new as RoomMessage,
            transaction_id: (payload.new as any).transaction_id || `rt-${(payload.new as any).id}`,
            messageType: (payload.new as any).user_id ? 'user' : 'agent'
          };
          onNewMessage(newMessage);
        }
      )
      .subscribe((status) => {
        console.log(`Room ${roomId} realtime subscription status:`, status);
      });
    
    channelRef.current = channel;

    return () => {
      console.log("Cleaning up: Removing channel for room:", roomId);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, onNewMessage]);
};
