
import { cn } from "@/lib/utils";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { SmartBarModeSelector } from "../SmartBarModeSelector";
import { SmartBarAgentButton } from "./SmartBarAgentButton";
import { SmartBarVoiceButton } from "./SmartBarVoiceButton";

interface SmartBarActionsProps {
  className?: string;
  disabled?: boolean;
}

export function SmartBarActions({ className, disabled = false }: SmartBarActionsProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <SmartBarModeSelector />
      <SmartBarAgentButton disabled={disabled} />
      <SmartBarFileButton disabled={disabled} />
      <SmartBarVoiceButton disabled={disabled} />
    </div>
  );
}
