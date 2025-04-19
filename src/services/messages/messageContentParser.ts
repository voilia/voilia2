
import { v4 as uuidv4 } from 'uuid';
import {
  MessageContent,
  TextBlock,
  CodeBlock,
  ImageBlock,
  MarkdownBlock
} from '@/types/message-content';

/**
 * Parse raw message text to identify different content blocks
 */
export function parseMessageContent(message: string): MessageContent[] {
  if (!message) {
    return [];
  }

  const contents: MessageContent[] = [];
  
  // Check if the message contains code blocks
  const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)\n```/g;
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const markdownRegex = /(?:\*\*.*?\*\*|__.*?__|_.*?_|\*.*?\*|~~.*?~~|`.*?`|\[.*?\]\(.*?\))/g;
  
  let lastIndex = 0;
  let match;
  
  // First, extract code blocks
  while ((match = codeBlockRegex.exec(message)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textBefore = message.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        contents.push(createTextBlock(textBefore));
      }
    }
    
    // Add code block
    contents.push({
      id: uuidv4(),
      type: "code",
      language: match[1] || "plaintext",
      code: match[2],
      createdAt: new Date().toISOString()
    } as CodeBlock);
    
    lastIndex = match.index + match[0].length;
  }
  
  // Process remaining text or entire message if no code blocks
  if (lastIndex < message.length) {
    const remainingText = message.substring(lastIndex);
    
    // Look for images in the remaining text
    lastIndex = 0;
    while ((match = imageRegex.exec(remainingText)) !== null) {
      // Add text before image
      if (match.index > lastIndex) {
        const textBefore = remainingText.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          contents.push(createTextBlock(textBefore));
        }
      }
      
      // Add image block
      contents.push({
        id: uuidv4(),
        type: "image",
        url: match[2],
        alt: match[1] || "",
        createdAt: new Date().toISOString()
      } as ImageBlock);
      
      lastIndex = match.index + match[0].length;
    }
    
    // Process final text segment or the whole remaining text if no images
    if (lastIndex < remainingText.length) {
      const finalText = remainingText.substring(lastIndex);
      
      // Check if text has markdown formatting
      if (markdownRegex.test(finalText)) {
        contents.push({
          id: uuidv4(),
          type: "markdown",
          content: finalText,
          createdAt: new Date().toISOString()
        } as MarkdownBlock);
      } else {
        contents.push(createTextBlock(finalText));
      }
    }
  }
  
  return contents;
}

function createTextBlock(text: string): TextBlock {
  // Determine if text has emojis or other rich content
  const hasEmojis = /[\p{Emoji}]/u.test(text);
  
  return {
    id: uuidv4(),
    type: "text",
    text: text,
    format: hasEmojis ? "rich" : "plain",
    createdAt: new Date().toISOString()
  };
}

/**
 * Convert rich message contents back to text representation
 */
export function contentsToText(contents: MessageContent[]): string {
  return contents.map(content => {
    switch (content.type) {
      case "text":
        return (content as TextBlock).text;
      case "code":
        const codeBlock = content as CodeBlock;
        return `\`\`\`${codeBlock.language || ""}\n${codeBlock.code}\n\`\`\``;
      case "markdown":
        return (content as MarkdownBlock).content;
      case "image":
        const imgBlock = content as ImageBlock;
        return `![${imgBlock.alt || ""}](${imgBlock.url})`;
      // Add other cases as needed
      default:
        return "";
    }
  }).join("\n\n");
}

/**
 * Enhance a room message with parsed content blocks
 */
export function enhanceRoomMessage(message: RoomMessage): EnhancedRoomMessage {
  if (!message.message_text) {
    return {
      ...message,
      contents: [],
      rawText: ""
    };
  }

  const contents = parseMessageContent(message.message_text);
  
  return {
    ...message,
    contents,
    rawText: message.message_text
  };
}
