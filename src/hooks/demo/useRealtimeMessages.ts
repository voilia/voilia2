
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RoomMessage } from "@/types/room-messages";
import { DEMO_ROOM_ID, DEMO_AGENT_ID } from "@/config/demo-constants";
import { v4 as uuidv4 } from 'uuid';

export function useRealtimeMessages(setMessages: (messages: RoomMessage[]) => void) {
  useEffect(() => {
    console.log("Setting up real-time message subscription");
    
    const channel = supabase
      .channel(`demo_room_${DEMO_ROOM_ID}`)
      .on('broadcast', { event: 'demo_message' }, (payload) => {
        if (payload.payload && typeof payload.payload === 'object') {
          const newMessage: RoomMessage = {
            id: `realtime-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            room_id: DEMO_ROOM_ID,
            user_id: null,
            agent_id: DEMO_AGENT_ID,
            message_text: payload.payload.message,
            created_at: new Date().toISOString(),
            updated_at: null,
            transaction_id: payload.payload.transactionId || uuidv4(),
            messageType: 'agent',
            isPending: false
          };
          
          // Fix: Create a new array with the previous messages and the new message
          setMessages((prev) => {
            const updatedMessages = [...prev, newMessage];
            return updatedMessages;
          });
        }
      })
      .subscribe((status) => {
        console.log("Supabase channel subscription status:", status);
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [setMessages]);
}
