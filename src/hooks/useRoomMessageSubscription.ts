
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RoomMessage } from "@/types/room-messages";
import { toast } from "sonner";

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
    
    try {
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
            
            const newMessage: RoomMessage = {
              ...payload.new as any,
              transaction_id: (payload.new as any).transaction_id || `rt-${(payload.new as any).id}`,
              messageType: isAiMessage ? 'agent' as const : 'user' as const,
              isPending: false
            };
            
            console.log("Processing realtime message:", {
              isAiMessage,
              transactionId: newMessage.transaction_id,
              messageType: newMessage.messageType
            });
            
            // Process immediately without delay
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
            
            const updatedMessage: RoomMessage = {
              ...payload.new as any,
              transaction_id: (payload.new as any).transaction_id || `rt-${(payload.new as any).id}`,
              messageType: isAiMessage ? 'agent' as const : 'user' as const,
              isPending: false
            };
            
            console.log("Processing updated message:", {
              isAiMessage,
              transactionId: updatedMessage.transaction_id,
              messageType: updatedMessage.messageType
            });
            
            // Process immediately without delay
            onNewMessage(updatedMessage);
          }
        )
        .subscribe((status) => {
          console.log(`Room ${roomId} realtime subscription status:`, status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to room messages');
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.error('Subscription error or closed:', status);
            toast.error("Lost connection to message updates. Please refresh.");
          }
        });
    
      channelRef.current = channel;
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
      toast.error("Failed to connect to message updates");
    }

    return () => {
      console.log("Cleaning up: Removing channel for room:", roomId);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, onNewMessage]);
};
