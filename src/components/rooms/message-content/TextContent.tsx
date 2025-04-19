
import React from "react";
import { TextBlock } from "@/types/message-content";
import { cn } from "@/lib/utils";

interface TextContentProps {
  content: TextBlock;
  className?: string;
}

export function TextContent({ content, className }: TextContentProps) {
  if (content.format === "markdown") {
    // For simple markdown, just handle basic formatting
    // For more complex markdown, use the MarkdownContent component
    return (
      <div 
        className={cn("text-sm whitespace-pre-wrap break-words", className)}
        style={{ overflowWrap: "anywhere" }}
      >
        {content.text}
      </div>
    );
  }

  if (content.format === "rich") {
    // Handle rich text with emojis and formatting
    return (
      <div 
        className={cn("text-sm whitespace-pre-wrap break-words", className)}
        style={{ overflowWrap: "anywhere" }}
        dangerouslySetInnerHTML={{ __html: content.text }}
      />
    );
  }

  // Default plain text
  return (
    <div 
      className={cn("text-sm whitespace-pre-wrap break-words", className)}
      style={{ overflowWrap: "anywhere" }}
    >
      {content.text}
    </div>
  );
}
