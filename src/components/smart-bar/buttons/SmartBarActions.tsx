
import { cn } from "@/lib/utils";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { SmartBarAgentButton } from "./SmartBarAgentButton";
import { SmartBarModeSelector } from "../SmartBarModeSelector";

interface SmartBarActionsProps {
  className?: string;
}

export function SmartBarActions({ className }: SmartBarActionsProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <SmartBarModeSelector className="mr-3" />
      <SmartBarAgentButton className="mr-3" />
      <SmartBarFileButton />
    </div>
  );
}
