
export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string | null;
  agent_id: string | null;
  message_text: string | null;
  created_at: string;
  updated_at: string | null;
  isPending?: boolean;
  transaction_id: string;
  messageType?: "user" | "agent";
}

export interface MessageGroup {
  userId: string | null;
  messages: RoomMessage[];
}
