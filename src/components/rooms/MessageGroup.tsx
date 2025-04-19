
import { RoomMessage } from "@/types/room-messages";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageStatus } from "@/components/rooms/MessageStatus";
import { MessageErrorBoundary } from "./MessageErrorBoundary";
import { useEffect, useState, useRef, useContext, createContext } from "react";

// Context to track which message is the latest in the entire chat
const LatestMessageContext = createContext<string | null>(null);

interface MessageGroupProps {
  messages: RoomMessage[];
  isUserGroup: boolean;
  isLatestGroup: boolean;
}

export function MessageGroup({ messages, isUserGroup, isLatestGroup }: MessageGroupProps) {
  if (!messages.length) return null;
  
  // The last message in this group
  const latestMessage = messages[messages.length - 1];
  
  // Only set the context if this is actually the latest group
  const latestMessageId = isLatestGroup ? latestMessage.id : null;
  
  return (
    <MessageErrorBoundary>
      <LatestMessageContext.Provider value={latestMessageId}>
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
                  isLastInGroup={index === messages.length - 1}
                />
              </MessageErrorBoundary>
            ))}
          </div>
        </div>
      </LatestMessageContext.Provider>
    </MessageErrorBoundary>
  );
}

interface MessageProps {
  message: RoomMessage;
  isUser: boolean;
  isLastInGroup: boolean;
}

function Message({ message, isUser, isLastInGroup }: MessageProps) {
  const latestMessageId = useContext(LatestMessageContext);
  const isLatestMessage = message.id === latestMessageId && !isUser;
  
  const [displayText, setDisplayText] = useState(message.message_text);
  const [isTyping, setIsTyping] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formattedTime = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
  
  // Skip processing placeholders
  const isPlaceholder = message.message_text.includes("processing your request") || 
                        message.message_text.includes("is being processed") ||
                        message.message_text.includes("awaiting response");
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);
                          
  // Process message text to handle newlines properly
  const processedText = displayText.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n');
  
  // Process typing animation only for the latest AI message
  useEffect(() => {
    // Skip if this is a placeholder or not the latest message
    if (isPlaceholder) {
      return;
    }
    
    // Only apply typing animation to the latest AI message
    if (isLatestMessage) {
      // Start with full text immediately to ensure nothing is cut off
      setDisplayText(message.message_text);
      
      // Check if the message appears to be newly created
      const messageAge = Date.now() - new Date(message.created_at).getTime();
      const isNewMessage = messageAge < 10000; // Consider messages under 10 seconds old as "new"
      
      // Only animate if it's a new message
      if (isNewMessage) {
        // Reset for animation
        setDisplayText('');
        setIsTyping(true);
        
        // The full text to type
        const fullText = message.message_text;
        let currentPos = 0;
        
        // Function to type next character
        const typeNextChar = () => {
          if (currentPos < fullText.length) {
            setDisplayText(fullText.substring(0, currentPos + 1));
            currentPos++;
            
            // Variable speed based on character
            const nextChar = fullText[currentPos] || '';
            let delay = 20; // Base typing speed
            
            // Adjust delay based on punctuation
            if (['.', '!', '?'].includes(nextChar)) {
              delay = 150; // Longer pause after sentence-ending punctuation
            } else if ([',', ';', ':'].includes(nextChar)) {
              delay = 80; // Medium pause after other punctuation
            }
            
            // Schedule next character
            typingTimerRef.current = setTimeout(typeNextChar, delay);
          } else {
            // Finished typing
            setIsTyping(false);
          }
        };
        
        // Start typing after a small delay
        typingTimerRef.current = setTimeout(() => {
          typeNextChar();
        }, 100);
        
        return () => {
          // Cleanup: show full text and clear any pending timers
          if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
          }
          setDisplayText(fullText);
          setIsTyping(false);
        };
      }
    } else {
      // Not the latest message - show full text immediately
      setDisplayText(message.message_text);
      setIsTyping(false);
    }
  }, [message.id, message.message_text, isLatestMessage, isPlaceholder, message.created_at]);
  
  // Don't render anything for placeholder messages
  if (isPlaceholder) return null;
  
  return (
    <div className="group w-full">
      <div 
        ref={messageRef}
        className={cn(
          "px-4 py-2 text-sm rounded-xl break-words whitespace-pre-wrap",
          isUser
            ? "bg-primary/10 text-foreground ml-auto rounded-tr-none"
            : "bg-muted text-foreground mr-auto rounded-tl-none",
          message.isPending && "opacity-70"
        )}
      >
        {processedText}
        {isTyping && (
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
