import { RoomMessage } from "@/hooks/useRoomMessages";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface MessageGroupProps {
  messages: RoomMessage[];
  isUserGroup: boolean;
}

export function MessageGroup({ messages, isUserGroup }: MessageGroupProps) {
  const { user } = useAuth();
  
  // Early exit for empty messages
  if (!messages.length) return null;
  
  // If we explicitly know this is a user group, trust that
  // Otherwise, verify based on the first message's user_id
  const isCurrentUserMessages = isUserGroup || (messages[0].user_id === user?.id);
  
  return (
    <div className={cn(
      "flex flex-col gap-1 py-2",
      isCurrentUserMessages ? "items-end" : "items-start"
    )}>
      <div className={cn(
        "flex flex-col max-w-[80%] space-y-1",
        isCurrentUserMessages ? "items-end" : "items-start"
      )}>
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message} 
            isUser={isCurrentUserMessages} 
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
        "px-4 py-2 text-sm rounded-xl",
        isUser
          ? "bg-primary/10 text-foreground ml-auto rounded-tr-none"
          : "bg-muted text-foreground mr-auto rounded-tl-none"
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
