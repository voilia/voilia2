
import { cn } from "@/lib/utils";
import { SmartBarModeButton } from "./SmartBarModeButton";
import { SmartBarAgentButton } from "./SmartBarAgentButton";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { SmartBarVoiceButton } from "./SmartBarVoiceButton";

interface SmartBarActionsProps {
  className?: string;
}

export function SmartBarActions({ className }: SmartBarActionsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <SmartBarModeButton />
      <SmartBarAgentButton />
      <SmartBarFileButton />
      <SmartBarVoiceButton className="md:hidden" />
    </div>
  );
}
