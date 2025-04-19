
import React from "react";
import { MessageContent } from "@/types/message-content";
import { TextContent } from "./TextContent";
import { CodeContent } from "./CodeContent";
import { ImageContent } from "./ImageContent";
import { VideoContent } from "./VideoContent";
import { FileContent } from "./FileContent";
import { FormContent } from "./FormContent";
import { ToolContent } from "./ToolContent";
import { EmbedContent } from "./EmbedContent";
import { MarkdownContent } from "./MarkdownContent";
import { AgentContent } from "./AgentContent";
import { ErrorContent } from "./ErrorContent";

interface MessageContentRendererProps {
  content: MessageContent;
  className?: string;
}

export function MessageContentRenderer({ content, className }: MessageContentRendererProps) {
  switch (content.type) {
    case "text":
      return <TextContent content={content} className={className} />;
    case "code":
      return <CodeContent content={content} className={className} />;
    case "image":
      return <ImageContent content={content} className={className} />;
    case "video":
      return <VideoContent content={content} className={className} />;
    case "file":
      return <FileContent content={content} className={className} />;
    case "form":
      return <FormContent content={content} className={className} />;
    case "tool":
      return <ToolContent content={content} className={className} />;
    case "embed":
      return <EmbedContent content={content} className={className} />;
    case "markdown":
      return <MarkdownContent content={content} className={className} />;
    case "agent":
      return <AgentContent content={content} className={className} />;
    case "error":
      return <ErrorContent content={content} className={className} />;
    default:
      return <div className="text-red-500">Unknown content type</div>;
  }
}
