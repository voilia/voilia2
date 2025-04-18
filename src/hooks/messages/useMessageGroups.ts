
import { useState, useEffect } from "react";
import { RoomMessage, MessageGroup } from "@/types/room-messages";

export function useMessageGroups(messages: RoomMessage[], currentUserId: string | null) {
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);

  useEffect(() => {
    if (!messages?.length) {
      setMessageGroups([]);
      return;
    }

    console.log("Grouping messages:", messages.length);
    
    // Sort messages by creation time to ensure correct order
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Group messages by sender
    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    sortedMessages.forEach((message) => {
      // Skip messages without content
      if (!message.message_text?.trim()) {
        console.log("Skipping message with empty content");
        return;
      }
      
      const isFromCurrentUser = message.user_id === currentUserId;
      // For user messages, use user_id; for agent messages, use agent_id or null
      const senderId = isFromCurrentUser ? currentUserId : message.agent_id || null;
      
      // Check if we should continue the current group or start a new one
      if (!currentGroup || currentGroup.userId !== senderId) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { userId: senderId, messages: [message] };
      } else {
        currentGroup.messages.push(message);
      }
    });

    // Add the last group if it exists
    if (currentGroup) {
      groups.push(currentGroup);
    }

    console.log("Grouped messages into", groups.length, "groups");
    setMessageGroups(groups);
  }, [messages, currentUserId]);

  return messageGroups;
}
