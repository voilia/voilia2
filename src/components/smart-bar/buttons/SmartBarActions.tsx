
import { cn } from "@/lib/utils";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { ModeSelectorPopover } from "./mode-selector/ModeSelectorPopover";
import { AgentSelectorPopover } from "./agent-selector/AgentSelectorPopover";
import { Brain, User } from "lucide-react";
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
        <SmartBarButton 
          icon={Brain}
          tooltip="Select Mode"
          className="text-foreground"
          customColor={colorValue}
        />
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
