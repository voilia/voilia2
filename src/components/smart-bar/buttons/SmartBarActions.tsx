
import { cn } from "@/lib/utils";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { SmartBarAgentButton } from "./SmartBarAgentButton";
import { SmartBarModeSelector } from "../SmartBarModeSelector";

interface SmartBarActionsProps {
  className?: string;
}

export function SmartBarActions({ className }: SmartBarActionsProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <SmartBarModeSelector />
      <SmartBarAgentButton />
      <SmartBarFileButton />
    </div>
  );
}
