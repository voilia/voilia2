
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
  
  // Get the last message to determine if this group contains the latest message
  const latestMessage = messages[messages.length - 1];
  const isLatestGroup = latestMessage.created_at === Math.max(
    ...messages.map(m => new Date(m.created_at).getTime())
  ).toString();
  
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
          {messages.map((message, index) => (
            <MessageErrorBoundary key={message.id}>
              <Message 
                key={message.id} 
                message={message} 
                isUser={isUserGroup}
                isLatestInGroup={index === messages.length - 1}
                isLatestOverall={index === messages.length - 1 && message.messageType === 'agent' && !isUserGroup}
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
  isLatestInGroup: boolean;
  isLatestOverall: boolean;
}

function Message({ message, isUser, isLatestInGroup, isLatestOverall }: MessageProps) {
  const [showMessage, setShowMessage] = useState(!isLatestOverall);
  const [currentText, setCurrentText] = useState(isLatestOverall ? '' : message.message_text);
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
    
    // Show message immediately if it's a user message or not the latest
    if (isUser || !isLatestOverall) {
      setShowMessage(true);
      setCurrentText(message.message_text);
      return;
    }
    
    // Only animate the latest AI message
    if (isLatestOverall) {
      const fullText = message.message_text;
      setShowMessage(true);
      setCurrentText('');
      setIsTyping(true);
      
      // Simulate typing with a more natural speed
      let i = 0;
      const typeNextCharacter = () => {
        if (i < fullText.length) {
          setCurrentText(prev => prev + fullText.charAt(i));
          i++;
          
          // Variable delay based on character type for more natural feeling
          const delay = fullText.charAt(i) === '.' || fullText.charAt(i) === '!' || fullText.charAt(i) === '?' 
            ? 150  // Pause longer at punctuation
            : fullText.charAt(i) === ',' || fullText.charAt(i) === ';' 
              ? 100 // Medium pause at commas
              : Math.random() * 15 + 25; // Random delay between 25-40ms for normal characters
              
          setTimeout(typeNextCharacter, delay);
        } else {
          setIsTyping(false);
        }
      };
      
      // Start typing with a small initial delay
      setTimeout(typeNextCharacter, 100);
      
      return () => {
        // If unmounting during animation, show the full text
        setCurrentText(fullText);
        setIsTyping(false);
      };
    }
  }, [message.id, message.message_text, isUser, isPlaceholder, isLatestOverall]);
  
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
        {isTyping && isLatestOverall && (
          <span className="typing-cursor"></span>
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
