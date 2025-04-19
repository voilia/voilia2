
import React from "react";
import { MessageContent } from "@/types/message-content";
import { TextContent } from "./TextContent";
import { CodeContent } from "./CodeContent";
import { ImageContent } from "./ImageContent";
import { MarkdownContent } from "./MarkdownContent";

// Placeholder components for types we haven't implemented yet
const PlaceholderContent = ({ type, className }: { type: string, className?: string }) => (
  <div className={className}>
    <div className="p-2 rounded bg-muted/50 text-center text-sm text-muted-foreground">
      {type} content (not implemented yet)
    </div>
  </div>
);

// Use placeholders for components we haven't created yet
const VideoContent = ({ content, className }: any) => (
  <PlaceholderContent type="Video" className={className} />
);

const FileContent = ({ content, className }: any) => (
  <PlaceholderContent type="File" className={className} />
);

const FormContent = ({ content, className }: any) => (
  <PlaceholderContent type="Form" className={className} />
);

const ToolContent = ({ content, className }: any) => (
  <PlaceholderContent type="Tool" className={className} />
);

const EmbedContent = ({ content, className }: any) => (
  <PlaceholderContent type="Embed" className={className} />
);

const AgentContent = ({ content, className }: any) => (
  <PlaceholderContent type="Agent" className={className} />
);

const ErrorContent = ({ content, className }: any) => (
  <div className={`p-2 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 ${className}`}>
    {content.message || "Error occurred"}
  </div>
);

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
