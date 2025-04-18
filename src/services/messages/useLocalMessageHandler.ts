
import { useCallback } from "react";
import { RoomMessage } from "@/types/room-messages";

export function useLocalMessageHandler() {
  const createLocalMessage = useCallback((
    message: Partial<RoomMessage> & Pick<RoomMessage, 'id' | 'room_id' | 'message_text' | 'created_at'>
  ): RoomMessage => {
    return {
      ...message,
      user_id: message.user_id ?? null,
      agent_id: message.agent_id ?? null,
      updated_at: message.updated_at ?? null,
      isPending: message.isPending !== undefined ? message.isPending : true,
      transaction_id: message.transaction_id || `local-${message.id}`,
      messageType: message.messageType || (message.user_id === null ? 'agent' : 'user')
    };
  }, []);

  return { createLocalMessage };
}
