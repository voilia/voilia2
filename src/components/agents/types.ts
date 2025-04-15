
import { LucideIcon } from "lucide-react";

export type AgentType = "prompt" | "tool" | "llm" | "moa" | "shadow";

export type AgentBadge = "popular" | "new" | "experimental" | "internal";

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  badges?: AgentBadge[];
  icon?: LucideIcon;
  color?: string;
  isPublic?: boolean;
}
