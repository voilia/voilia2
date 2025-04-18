
import { RoomWelcomeMessage } from "./RoomWelcomeMessage";

interface EmptyMessagesStateProps {
  roomName?: string;
}

export function EmptyMessagesState({ roomName }: EmptyMessagesStateProps) {
  return <RoomWelcomeMessage roomName={roomName} />;
}
