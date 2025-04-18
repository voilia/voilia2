import { RoomMessage } from "@/types/room-messages";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageStatus } from "@/components/rooms/MessageStatus";
import { MessageErrorBoundary } from "./MessageErrorBoundary";

interface MessageGroupProps {
  messages: RoomMessage[];
  isUserGroup: boolean;
}

export function MessageGroup({ messages, isUserGroup }: MessageGroupProps) {
  if (!messages.length) return null;
  
  return (
    <MessageErrorBoundary>
      <div className={cn(
        "flex flex-col gap-1 py-2",
        isUserGroup ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "flex flex-col max-w-[80%] space-y-1",
          isUserGroup ? "items-end" : "items-start"
        )}>
          {messages.map((message) => (
            <MessageErrorBoundary key={message.id}>
              <Message 
                key={message.id} 
                message={message} 
                isUser={isUserGroup} 
              />
            </MessageErrorBoundary>
          ))}
        </div>
      </div>
    </MessageErrorBoundary>
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
          : "bg-muted text-foreground mr-auto rounded-tl-none",
        message.isPending && "opacity-70"
      )}>
        {message.message_text}
      </div>
      <MessageStatus 
        time={time}
        isPending={message.isPending}
        align={isUser ? "right" : "left"}
      />
    </div>
  );
}
