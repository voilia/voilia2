
import { RoomMessage } from "@/types/room-messages";
import { MessageGroup } from "./MessageGroup";

interface EmptyMessagesStateProps {
  roomName?: string;
}

export function EmptyMessagesState({ roomName }: EmptyMessagesStateProps) {
  // Create a welcome message using the same format as regular messages
  const welcomeMessage: RoomMessage = {
    id: 'welcome-message',
    room_id: '',
    user_id: null,
    agent_id: null,
    message_text: `👋 Welcome to ${roomName || "your new room"}! I'm your AI assistant, and I'm here to help you explore ideas, solve problems, and create something amazing together. Feel free to ask me anything - I'm excited to start our conversation!`,
    created_at: new Date().toISOString(),
    updated_at: null,
    isPending: false,
    transaction_id: 'welcome-message',
    messageType: 'agent'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
      <MessageGroup 
        messages={[welcomeMessage]} 
        isUserGroup={false}
      />
    </div>
  );
}
