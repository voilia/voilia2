
import { cn } from "@/lib/utils";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { ModeSelectorPopover } from "./mode-selector/ModeSelectorPopover";
import { AgentSelectorPopover } from "./agent-selector/AgentSelectorPopover";
import { BotMessageSquare, User } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";
import { useSmartBarColors } from "../hooks/useSmartBarColors";
import { useSmartBar } from "../context/SmartBarContext";

interface SmartBarActionsProps {
  className?: string;
}

export function SmartBarActions({ className }: SmartBarActionsProps) {
  const { mode } = useSmartBar();
  const { getColors } = useSmartBarColors();
  const colorValue = getColors(mode);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ModeSelectorPopover>
        <button 
          className="flex items-center justify-center h-8 w-8 rounded-md transition-colors hover:bg-accent/80 focus:outline-none"
          style={{ color: colorValue }}
        >
          <BotMessageSquare className="h-5 w-5" />
          <span className="sr-only">Select Mode</span>
        </button>
      </ModeSelectorPopover>
      
      <AgentSelectorPopover>
        <SmartBarButton 
          icon={User}
          tooltip="Select Agent" 
          className="text-foreground"
        />
      </AgentSelectorPopover>

      <SmartBarFileButton />
    </div>
  );
}
