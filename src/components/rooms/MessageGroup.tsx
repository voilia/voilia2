
import { RoomMessage } from "@/types/room-messages";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageStatus } from "@/components/rooms/MessageStatus";
import { MessageErrorBoundary } from "./MessageErrorBoundary";
import { useEffect, useState, useRef } from "react";

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
  const [showMessage, setShowMessage] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const formattedTime = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
  
  // Skip processing placeholders
  const isPlaceholder = message.message_text.includes("processing your request") || 
                        message.message_text.includes("is being processed") ||
                        message.message_text.includes("awaiting response");
  
  // Check if we should show this message
  useEffect(() => {
    // Hide placeholder messages entirely
    if (isPlaceholder) {
      setShowMessage(false);
      return;
    }
    
    // Show message immediately if it's a user message
    if (isUser) {
      setShowMessage(true);
      setCurrentText(message.message_text);
      return;
    }
    
    // For AI messages, trigger typing animation
    setShowMessage(true);
    
    // If it's an AI response, animate it like typing
    if (!isUser && !isPlaceholder) {
      const fullText = message.message_text;
      setCurrentText('');
      setIsTyping(true);
      
      // Simulate typing
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setCurrentText(prev => prev + fullText.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 15); // Adjust speed as needed
      
      return () => {
        clearInterval(typingInterval);
        setIsTyping(false);
      };
    }
  }, [message.id, message.message_text, isUser, isPlaceholder]);
  
  // Don't render anything for placeholder messages
  if (isPlaceholder || !showMessage) return null;
  
  return (
    <div className="group w-full">
      <div 
        ref={messageRef}
        className={cn(
          "px-4 py-2 text-sm rounded-xl break-words",
          isUser
            ? "bg-primary/10 text-foreground ml-auto rounded-tr-none"
            : "bg-muted text-foreground mr-auto rounded-tl-none",
          message.isPending && "opacity-70"
        )}
      >
        {currentText}
        {isTyping && !isUser && (
          <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse"></span>
        )}
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
