
import { cn } from "@/lib/utils";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { SmartBarAgentButton } from "./SmartBarAgentButton";

interface SmartBarActionsProps {
  className?: string;
}

export function SmartBarActions({ className }: SmartBarActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SmartBarFileButton />
      <SmartBarAgentButton />
    </div>
  );
}
