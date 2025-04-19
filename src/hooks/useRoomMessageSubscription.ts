
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
  const messageCache = useRef<Set<string>>(new Set());

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

  // Process an incoming message with deduplication
  const processMessage = useCallback((payload: any, isNewMessage: boolean) => {
    const messageId = payload.new.id;
    const cacheKey = `${messageId}-${isNewMessage ? 'new' : 'update'}`;
    
    // Skip if we've already processed this exact message recently
    if (messageCache.current.has(cacheKey)) {
      console.log("Skipping duplicate message:", cacheKey);
      return;
    }
    
    // Add to cache to prevent duplicates
    messageCache.current.add(cacheKey);
    
    // Clear from cache after a while to prevent memory leaks
    setTimeout(() => {
      messageCache.current.delete(cacheKey);
    }, 10000);
    
    console.log(`${isNewMessage ? "New" : "Updated"} message from realtime:`, payload.new);
    
    // Check if this is an AI message
    const isAiMessage = !payload.new.user_id && payload.new.agent_id;
    
    const newMessage: RoomMessage = {
      ...payload.new as any,
      transaction_id: (payload.new as any).transaction_id || `rt-${(payload.new as any).id}`,
      messageType: isAiMessage ? 'agent' as const : 'user' as const,
      isPending: false
    };
    
    console.log(`Processing ${isNewMessage ? "new" : "updated"} message:`, {
      isAiMessage,
      transactionId: newMessage.transaction_id,
      messageType: newMessage.messageType
    });
    
    // Use requestAnimationFrame to ensure smooth UI updates
    requestAnimationFrame(() => {
      onNewMessage(newMessage);
    });
  }, [onNewMessage]);

  // Setup subscription function with better handling
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
            retryIntervalMs: 1000,
            retryBackoffMs: 1000
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
          (payload) => processMessage(payload, true)
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "room_messages",
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => processMessage(payload, false)
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
            }, 25000); // Every 25 seconds
            
            // Ensure ping interval is cleared on cleanup
            return () => clearInterval(pingInterval);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.error('Subscription error or closed:', status);
            
            // Attempt to reconnect immediately for faster recovery
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current += 1;
              // Use shorter delays for faster reconnection
              const delay = Math.min(500 * Math.pow(1.5, reconnectAttempts.current), 10000);
              
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
              // Show error but keep trying in background
              toast.error("Connection issues detected. Messages may be delayed.", {
                id: "subscription-error",
                duration: 3000
              });
              
              // Still try to reconnect after a longer delay
              if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
              }
              
              reconnectTimeoutRef.current = setTimeout(() => {
                console.log("Final reconnection attempt...");
                reconnectAttempts.current = 0;
                setupSubscription();
              }, 5000);
            }
          }
        });
    
      channelRef.current = channel;
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
      // Silent error handling to avoid disrupting the user experience
      // Try again after a short delay
      setTimeout(() => {
        setupSubscription();
      }, 2000);
    }
  }, [roomId, onNewMessage, cleanupSubscription, processMessage]);

  // Initial setup with immediate connection retry on failure
  useEffect(() => {
    if (!roomId) return;

    setupSubscription();
    
    // Add a backup timer to check connection status
    const checkConnectionTimer = setInterval(() => {
      if (!channelRef.current || channelRef.current.state === 'CLOSED') {
        console.log('Connection check failed, reconnecting...');
        setupSubscription();
      }
    }, 10000); // Check every 10 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(checkConnectionTimer);
      cleanupSubscription();
    };
  }, [roomId, setupSubscription, cleanupSubscription]);

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
