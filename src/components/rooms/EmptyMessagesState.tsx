
import { MessageSquare } from "lucide-react";

interface EmptyMessagesStateProps {
  roomName?: string;
}

export function EmptyMessagesState({ roomName }: EmptyMessagesStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-full" />
        <MessageSquare className="h-16 w-16 text-muted-foreground/50 relative z-10" />
      </div>
      <h3 className="text-xl font-medium mb-2">No messages yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {roomName 
          ? `This is the beginning of your conversation in ${roomName}`
          : "This is the beginning of your conversation"
        }
      </p>
      <p className="text-sm text-muted-foreground">
        Start chatting by typing a message below
      </p>
    </div>
  );
}
