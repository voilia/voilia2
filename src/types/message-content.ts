
import { LucideIcon } from "lucide-react";
import { RoomMessage } from "@/types/room-messages";

/**
 * Base type for all message content blocks
 */
export interface MessageContentBlock {
  id: string;
  type: MessageContentType;
  createdAt: string;
}

/**
 * All possible content types that can be rendered in messages
 */
export type MessageContentType = 
  | "text"
  | "code"
  | "image"
  | "video"
  | "file"
  | "form"
  | "tool"
  | "embed"
  | "markdown"
  | "agent"
  | "error";

/**
 * Text content block for simple messages
 */
export interface TextBlock extends MessageContentBlock {
  type: "text";
  text: string;
  format?: "plain" | "rich" | "markdown";
}

/**
 * Code block with syntax highlighting
 */
export interface CodeBlock extends MessageContentBlock {
  type: "code";
  code: string;
  language?: string;
  title?: string;
}

/**
 * Image content
 */
export interface ImageBlock extends MessageContentBlock {
  type: "image";
  url: string;
  alt?: string;
  caption?: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
}

/**
 * Video content
 */
export interface VideoBlock extends MessageContentBlock {
  type: "video";
  url: string;
  provider?: "youtube" | "vimeo" | "local" | "other";
  poster?: string;
  title?: string;
  duration?: number;
}

/**
 * Generic file attachment
 */
export interface FileBlock extends MessageContentBlock {
  type: "file";
  url: string;
  name: string;
  size?: number;
  fileType?: string;
  icon?: LucideIcon;
}

/**
 * Interactive form element
 */
export interface FormBlock extends MessageContentBlock {
  type: "form";
  formId: string;
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
}

export interface FormField {
  id: string;
  type: "text" | "number" | "select" | "checkbox" | "radio" | "textarea";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: any;
}

/**
 * Tool execution result
 */
export interface ToolBlock extends MessageContentBlock {
  type: "tool";
  toolName: string;
  result: any;
  status: "loading" | "success" | "error";
  metadata?: Record<string, any>;
}

/**
 * Embedded content like diagrams, presentations
 */
export interface EmbedBlock extends MessageContentBlock {
  type: "embed";
  embedType: "diagram" | "chart" | "presentation" | "map" | "spreadsheet" | "custom";
  data: any;
  aspectRatio?: number;
  width?: number;
  height?: number;
}

/**
 * Rich markdown content 
 */
export interface MarkdownBlock extends MessageContentBlock {
  type: "markdown";
  content: string;
  allowHtml?: boolean;
}

/**
 * Agent reference or context info
 */
export interface AgentBlock extends MessageContentBlock {
  type: "agent";
  agentId: string;
  agentName: string;
  agentIcon?: string;
  contextText?: string;
  capabilities?: string[];
}

/**
 * Error display block
 */
export interface ErrorBlock extends MessageContentBlock {
  type: "error";
  message: string;
  code?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Union type of all possible content blocks
 */
export type MessageContent = 
  | TextBlock
  | CodeBlock
  | ImageBlock
  | VideoBlock
  | FileBlock
  | FormBlock
  | ToolBlock
  | EmbedBlock
  | MarkdownBlock
  | AgentBlock
  | ErrorBlock;

/**
 * Extended room message with content blocks
 */
export interface EnhancedRoomMessage {
  contents: MessageContent[];
  rawText?: string; // Original message text for fallback
}
