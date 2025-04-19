
import React from "react";
import { MarkdownBlock } from "@/types/message-content";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  content: MarkdownBlock;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown>
        {content.content}
      </ReactMarkdown>
    </div>
  );
}
