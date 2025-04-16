
import { cn } from "@/lib/utils";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { SmartBarAgentButton } from "./SmartBarAgentButton";
import { SmartBarModeSelector } from "../SmartBarModeSelector";
import type { SmartBarMode } from "../SmartBarModeSelector";

interface SmartBarActionsProps {
  className?: string;
  selectedMode: SmartBarMode;
  onModeChange: (mode: SmartBarMode) => void;
}

export function SmartBarActions({ className, selectedMode, onModeChange }: SmartBarActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SmartBarModeSelector 
        selectedMode={selectedMode} 
        onModeChange={onModeChange}
        className="mr-2"
      />
      <SmartBarAgentButton />
      <SmartBarFileButton />
    </div>
  );
}
