
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
  const isMounted = useRef<boolean>(true);
  const isUserActive = useRef<boolean>(true);
  const isReconnecting = useRef<boolean>(false);

  // Clean up function for subscription - with safety checks
  const cleanupSubscription = useCallback(() => {
    try {
      if (channelRef.current) {
        console.log("Cleaning up: Removing channel for room:", roomId);
        
        // Track cleanup in-progress to prevent concurrent cleanup attempts
        if (isReconnecting.current) {
          console.log("Cleanup already in progress, skipping");
          return;
        }
        
        isReconnecting.current = true;
        
        supabase.removeChannel(channelRef.current).then(() => {
          channelRef.current = null;
          isReconnecting.current = false;
          console.log("Channel removed successfully");
        }).catch(err => {
          console.error("Error removing channel:", err);
          channelRef.current = null;
          isReconnecting.current = false;
        });
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    } catch (err) {
      console.error("Error during cleanup:", err);
      isReconnecting.current = false;
      channelRef.current = null;
    }
  }, [roomId]);

  // Process an incoming message with improved deduplication
  const processMessage = useCallback((payload: any, isNewMessage: boolean) => {
    if (!isMounted.current) return;
    
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
    
    // Process immediately without any delay for best real-time experience
    onNewMessage(newMessage);
  }, [onNewMessage]);

  // Setup subscription function with intelligent reconnection
  const setupSubscription = useCallback(() => {
    if (!roomId || !isMounted.current || !isUserActive.current || isReconnecting.current) return;
    
    isReconnecting.current = true;
    
    // Clean up any existing subscription first
    if (channelRef.current) {
      cleanupSubscription();
    }
    
    console.log("Setting up realtime subscription for room:", roomId);
    
    try {
      const channel = supabase
        .channel(`room_${roomId}_messages`, {
          config: {
            presence: { key: Date.now().toString() },
            broadcast: { self: true },
            retryIntervalMs: 800,
            retryBackoffMs: 800
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
          
          // Auto-retry on error if mounted and active
          if (isMounted.current && isUserActive.current) {
            setTimeout(() => {
              if (!isReconnecting.current) {
                setupSubscription();
              }
            }, 1000);
          }
        })
        .subscribe(async (status) => {
          console.log(`Room ${roomId} realtime subscription status:`, status);
          isReconnecting.current = false;
          
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to room messages');
            reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
            
            // More efficient ping interval - only if tab is active
            if (isUserActive.current && isMounted.current) {
              const pingInterval = setInterval(() => {
                if (channelRef.current && isUserActive.current && isMounted.current) {
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
            }
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.error('Subscription error or closed:', status);
            
            // Only attempt to reconnect if component is still mounted and user is active
            if (isMounted.current && isUserActive.current) {
              // Use faster reconnection strategy
              const shouldReconnect = reconnectAttempts.current < maxReconnectAttempts;
              
              if (shouldReconnect) {
                reconnectAttempts.current += 1;
                // Shorter delays for faster recovery
                const delay = Math.min(500 * Math.pow(1.5, reconnectAttempts.current), 5000);
                
                console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts}) in ${delay}ms`);
                
                // Clear any existing reconnect timeout
                if (reconnectTimeoutRef.current) {
                  clearTimeout(reconnectTimeoutRef.current);
                }
                
                // Set timeout for reconnection
                reconnectTimeoutRef.current = setTimeout(() => {
                  if (isMounted.current && isUserActive.current && !isReconnecting.current) {
                    console.log("Attempting to reconnect now...");
                    setupSubscription();
                  }
                }, delay);
              } else {
                // Silent failure - just try one more time after a delay
                setTimeout(() => {
                  if (isMounted.current && isUserActive.current && !isReconnecting.current) {
                    console.log("Final reconnection attempt");
                    reconnectAttempts.current = 0;
                    setupSubscription();
                  }
                }, 3000);
              }
            }
          }
        });
    
      channelRef.current = channel;
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
      isReconnecting.current = false;
      
      // Silent retry after a short delay
      if (isMounted.current && isUserActive.current) {
        setTimeout(() => {
          if (!isReconnecting.current) {
            setupSubscription();
          }
        }, 1500);
      }
    }
  }, [roomId, onNewMessage, cleanupSubscription, processMessage]);

  // Track visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      isUserActive.current = document.visibilityState === 'visible';
      
      if (isUserActive.current) {
        console.log('Tab is now visible, checking subscription status');
        
        // Check if channel exists and is in CLOSED state
        if (!channelRef.current || channelRef.current?.state === 'CLOSED') {
          console.log('Subscription is closed or null, reconnecting...');
          reconnectAttempts.current = 0; // Reset counter on manual reconnect
          
          // Ensure we're not already reconnecting
          if (!isReconnecting.current) {
            setupSubscription();
          }
        }
      } else {
        console.log('Tab is now hidden, pausing aggressive reconnection');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setupSubscription]);

  // Initial setup with component lifecycle management
  useEffect(() => {
    if (!roomId) return;
    
    isMounted.current = true;
    isUserActive.current = document.visibilityState === 'visible';
    
    console.log("Tab visibility state on mount:", isUserActive.current ? "VISIBLE" : "HIDDEN");

    // Setup the subscription
    setupSubscription();
    
    // On cleanup
    return () => {
      isMounted.current = false;
      isUserActive.current = false;
      
      // Clean up the subscription
      cleanupSubscription();
    };
  }, [roomId, setupSubscription, cleanupSubscription]);

  return null; // No need to return anything
};
