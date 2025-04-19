
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RoomMessage } from "@/types/room-messages";
import { toast } from "sonner";

export const useRoomMessageSubscription = (
  roomId: string | undefined,
  onNewMessage: (message: RoomMessage) => void
) => {
  const channelRef = useRef<any>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up function for subscription
  const cleanupSubscription = useCallback(() => {
    if (channelRef.current) {
      console.log("Cleaning up: Removing channel for room:", roomId);
      supabase.removeChannel(channelRef.current).then(() => {
        channelRef.current = null;
      }).catch(err => {
        console.error("Error removing channel:", err);
        channelRef.current = null;
      });
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, [roomId]);

  // Setup subscription function
  const setupSubscription = useCallback(() => {
    if (!roomId) return;
    
    cleanupSubscription();
    
    console.log("Setting up realtime subscription for room:", roomId);
    
    try {
      const channel = supabase
        .channel(`room_${roomId}_messages`, {
          config: {
            presence: { key: Date.now().toString() },
            broadcast: { self: true },
            retryIntervalMs: 3000,
            retryBackoffMs: 5000
          }
        })
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
        .on('error', (error) => {
          console.error('Supabase realtime error:', error);
        })
        .subscribe(async (status) => {
          console.log(`Room ${roomId} realtime subscription status:`, status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to room messages');
            reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
            
            // Ping the channel periodically to keep it alive
            const pingInterval = setInterval(() => {
              if (channelRef.current) {
                channelRef.current.send({
                  type: 'broadcast',
                  event: 'ping',
                  payload: { timestamp: Date.now() }
                }).catch(err => {
                  console.warn('Error pinging channel:', err);
                });
              } else {
                clearInterval(pingInterval);
              }
            }, 30000); // Every 30 seconds
            
            // Clear interval on cleanup
            return () => clearInterval(pingInterval);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.error('Subscription error or closed:', status);
            
            // Attempt to reconnect if we haven't exceeded max attempts
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current += 1;
              const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Exponential backoff
              
              console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts}) in ${delay}ms`);
              
              // Clear any existing reconnect timeout
              if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
              }
              
              // Set timeout for reconnection
              reconnectTimeoutRef.current = setTimeout(() => {
                console.log("Attempting to reconnect now...");
                setupSubscription();
              }, delay);
            } else {
              // We've exceeded max reconnect attempts, show error to user
              toast.error("Lost connection to message updates. Please refresh.", {
                id: "subscription-error"
              });
            }
          }
        });
    
      channelRef.current = channel;
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
      toast.error("Failed to connect to message updates", {
        id: "subscription-error"
      });
    }
  }, [roomId, onNewMessage, cleanupSubscription]);

  // Initial setup
  useEffect(() => {
    if (!roomId) return;

    setupSubscription();

    // Cleanup on unmount
    return () => {
      cleanupSubscription();
    };
  }, [roomId, onNewMessage, setupSubscription, cleanupSubscription]);

  // Add window focus/blur event listeners to handle reconnection
  useEffect(() => {
    if (!roomId) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab is now visible, checking subscription status');
        
        // Check if channel exists and is in CLOSED state
        if (!channelRef.current || channelRef.current?.state === 'CLOSED') {
          console.log('Subscription is closed or null, reconnecting...');
          reconnectAttempts.current = 0; // Reset counter on manual reconnect
          setupSubscription();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [roomId, setupSubscription]);
};
