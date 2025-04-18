
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
          console.log("New message from realtime subscription:", payload.new);
          // Check if this is an AI message (null user_id and has agent_id)
          const isAiMessage = !payload.new.user_id && payload.new.agent_id;
          
          const newMessage = {
            ...payload.new as RoomMessage,
            transaction_id: (payload.new as any).transaction_id || `rt-${(payload.new as any).id}`,
            messageType: isAiMessage ? 'agent' as const : 'user' as const
          };
          
          console.log("Processing realtime message:", {
            isAiMessage,
            transactionId: newMessage.transaction_id,
            messageType: newMessage.messageType
          });
          
          onNewMessage(newMessage);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log("Updated message from realtime:", payload.new);
          const isAiMessage = !payload.new.user_id && payload.new.agent_id;
          
          const updatedMessage = {
            ...payload.new as RoomMessage,
            transaction_id: (payload.new as any).transaction_id || `rt-${(payload.new as any).id}`,
            messageType: isAiMessage ? 'agent' as const : 'user' as const
          };
          
          console.log("Processing updated message:", {
            isAiMessage,
            transactionId: updatedMessage.transaction_id,
            messageType: updatedMessage.messageType
          });
          
          onNewMessage(updatedMessage);
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
