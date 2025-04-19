
import { RoomMessage } from "@/types/room-messages";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageStatus } from "@/components/rooms/MessageStatus";
import { MessageErrorBoundary } from "./MessageErrorBoundary";
import { useEffect, useState } from "react";

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
  const [showPlaceholder, setShowPlaceholder] = useState(message.isPending && message.message_text.includes("Waiting for response"));
  const formattedTime = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
  
  // Remove "Waiting for response" placeholder messages after 5 seconds if they're still pending
  useEffect(() => {
    if (showPlaceholder) {
      const timer = setTimeout(() => {
        setShowPlaceholder(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPlaceholder]);
  
  // Don't render placeholder messages after timeout expires
  if (showPlaceholder && !message.isPending) return null;
  if (showPlaceholder && message.message_text.includes("Waiting for response")) return null;
  
  return (
    <div className="group w-full">
      <div className={cn(
        "px-4 py-2 text-sm rounded-xl break-words",
        isUser
          ? "bg-primary/10 text-foreground ml-auto rounded-tr-none"
          : "bg-muted text-foreground mr-auto rounded-tl-none",
        message.isPending && "opacity-70"
      )}>
        {message.message_text}
      </div>
      <MessageStatus 
        time={formattedTime}
        timestamp={message.created_at}
        isPending={message.isPending}
        align={isUser ? "right" : "left"}
      />
    </div>
  );
}
