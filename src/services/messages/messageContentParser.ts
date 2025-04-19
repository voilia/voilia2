
import { v4 as uuidv4 } from 'uuid';
import { 
  MessageContent, 
  TextBlock, 
  MarkdownBlock, 
  CodeBlock,
} from '@/types/message-content';
import { RoomMessage } from '@/types/room-messages';

/**
 * Parses a room message into structured message content blocks
 */
export function parseRoomMessage(message: RoomMessage): MessageContent[] {
  const contents: MessageContent[] = [];
  const text = message.message_text || '';
  
  // Simple detection of content types based on patterns
  
  // Check for code blocks with markdown-style backticks
  const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
  let codeMatch;
  let lastIndex = 0;
  
  while ((codeMatch = codeBlockRegex.exec(text)) !== null) {
    // Add any text before this code block
    if (codeMatch.index > lastIndex) {
      const textBefore = text.substring(lastIndex, codeMatch.index).trim();
      if (textBefore) {
        contents.push(createTextBlock(textBefore));
      }
    }
    
    // Add the code block
    const language = codeMatch[1] || '';
    const code = codeMatch[2];
    contents.push(createCodeBlock(code, language));
    
    lastIndex = codeMatch.index + codeMatch[0].length;
  }
  
  // Add remaining text after the last code block
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex).trim();
    if (remainingText) {
      // Check if the text appears to be markdown
      if (isMarkdown(remainingText)) {
        contents.push(createMarkdownBlock(remainingText));
      } else {
        contents.push(createTextBlock(remainingText));
      }
    }
  }
  
  // If no content was detected, treat the entire message as text
  if (contents.length === 0 && text) {
    contents.push(createTextBlock(text));
  }
  
  return contents;
}

/**
 * Creates a simple text block
 */
function createTextBlock(text: string): TextBlock {
  return {
    id: uuidv4(),
    type: 'text',
    text,
    format: 'plain',
    createdAt: new Date().toISOString()
  };
}

/**
 * Creates a markdown block
 */
function createMarkdownBlock(content: string): MarkdownBlock {
  return {
    id: uuidv4(),
    type: 'markdown',
    content,
    createdAt: new Date().toISOString()
  };
}

/**
 * Creates a code block
 */
function createCodeBlock(code: string, language: string = ''): CodeBlock {
  return {
    id: uuidv4(),
    type: 'code',
    code,
    language,
    createdAt: new Date().toISOString()
  };
}

/**
 * Check if text appears to be markdown
 */
function isMarkdown(text: string): boolean {
  // Basic heuristic to detect markdown syntax
  const markdownPatterns = [
    /^#+ /, // Headers
    /\*\*.+\*\*/, // Bold
    /\*.+\*/, // Italic
    /\[.+\]\(.+\)/, // Links
    /^\s*[-*+] /, // Lists
    /^\s*\d+\. /, // Numbered lists
    /^>.+$/, // Blockquotes
    /!\[.+\]\(.+\)/, // Images
    /~~.+~~/, // Strikethrough
    /\|.+\|.+\|/ // Tables
  ];
  
  return markdownPatterns.some(pattern => pattern.test(text));
}

/**
 * Convert a RoomMessage to an EnhancedRoomMessage with content blocks
 */
export function enhanceRoomMessage(message: RoomMessage): {
  contents: MessageContent[];
  rawText?: string;
} {
  return {
    contents: parseRoomMessage(message),
    rawText: message.message_text
  };
}
