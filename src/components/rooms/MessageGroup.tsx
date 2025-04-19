
import { RoomMessage } from "@/types/room-messages";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageStatus } from "@/components/rooms/MessageStatus";
import { MessageErrorBoundary } from "./MessageErrorBoundary";
import { MessageContentRenderer } from "./message-content/MessageContent";
import { enhanceRoomMessage } from "@/services/messages/messageContentParser";

interface MessageGroupProps {
  messages: RoomMessage[];
  isUserGroup: boolean;
}

export function MessageGroup({ messages, isUserGroup }: MessageGroupProps) {
  if (!messages.length) return null;
  
  return (
    <MessageErrorBoundary>
      <div className={cn(
        "flex flex-col gap-1 py-2 max-w-full",
        isUserGroup ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "flex flex-col max-w-[85%] space-y-1",
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
  
  // Enhance regular message to include content blocks
  const enhancedMessage = enhanceRoomMessage(message);
  
  return (
    <div className="group w-full">
      <div className={cn(
        "px-4 py-2 text-sm rounded-xl break-words",
        isUser
          ? "bg-primary/10 text-foreground ml-auto rounded-tr-none"
          : "bg-muted text-foreground mr-auto rounded-tl-none",
        message.isPending && "opacity-70"
      )}>
        {enhancedMessage.contents.length > 0 ? (
          <div className="space-y-2">
            {enhancedMessage.contents.map((content) => (
              <MessageContentRenderer 
                key={content.id} 
                content={content} 
              />
            ))}
          </div>
        ) : (
          // Fallback to original message text
          message.message_text
        )}
      </div>
      <MessageStatus 
        time={time}
        isPending={message.isPending}
        align={isUser ? "right" : "left"}
      />
    </div>
  );
}
