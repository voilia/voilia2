
import { cn } from "@/lib/utils";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { SmartBarAgentButton } from "./SmartBarAgentButton";
import { SmartBarModeSelector } from "../SmartBarModeSelector";
import type { SmartBarMode } from "../types/smart-bar-types";

interface SmartBarActionsProps {
  className?: string;
}

export function SmartBarActions({ className }: SmartBarActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SmartBarModeSelector className="mr-2" />
      <SmartBarAgentButton />
      <SmartBarFileButton />
    </div>
  );
}
