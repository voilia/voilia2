
import { RoomMessage } from "@/hooks/useRoomMessages";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface MessageGroupProps {
  messages: RoomMessage[];
  isUserGroup: boolean;
}

export function MessageGroup({ messages, isUserGroup }: MessageGroupProps) {
  if (!messages.length) return null;

  return (
    <div className={cn(
      "flex flex-col gap-1 py-2",
      isUserGroup ? "items-end" : "items-start"
    )}>
      <div className={cn(
        "flex flex-col max-w-[80%] space-y-1",
        isUserGroup ? "items-end" : "items-start"
      )}>
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message} 
            isUser={isUserGroup} 
          />
        ))}
      </div>
    </div>
  );
}

interface MessageProps {
  message: RoomMessage;
  isUser: boolean;
}

function Message({ message, isUser }: MessageProps) {
  const time = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
  
  return (
    <div className="group">
      <div className={cn(
        "px-4 py-2 rounded-2xl",
        isUser
          ? "bg-primary text-primary-foreground rounded-tr-none"
          : "bg-muted text-foreground rounded-tl-none"
      )}>
        {message.message_text}
      </div>
      <div className={cn(
        "text-xs text-muted-foreground mt-1",
        isUser ? "text-right" : "text-left"
      )}>
        {time}
      </div>
    </div>
  );
}
