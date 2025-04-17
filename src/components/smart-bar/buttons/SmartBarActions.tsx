
import { cn } from "@/lib/utils";
import { SmartBarFileButton } from "./SmartBarFileButton";
import { ModeSelectorPopover } from "./mode-selector/ModeSelectorPopover";
import { AgentSelectorPopover } from "./agent-selector/AgentSelectorPopover";
import { BotMessageSquare, Palette, User, Wrench, Vault } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";
import { useSmartBarColors } from "../hooks/useSmartBarColors";
import { useSmartBar } from "../context/SmartBarContext";
import type { SmartBarMode } from "../types/smart-bar-types";

interface SmartBarActionsProps {
  className?: string;
  disabled?: boolean;
}

export function SmartBarActions({ className, disabled = false }: SmartBarActionsProps) {
  const { mode } = useSmartBar();
  const { getColors } = useSmartBarColors();
  const colorValue = getColors(mode);

  // Get the current mode icon based on the active mode
  const getModeIcon = (currentMode: SmartBarMode) => {
    switch (currentMode) {
      case "chat": return BotMessageSquare;
      case "visual": return Palette;
      case "assist": return Wrench;
      case "vault": return Vault;
      default: return BotMessageSquare;
    }
  };

  const ModeIcon = getModeIcon(mode);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ModeSelectorPopover disabled={disabled}>
        <button 
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-md transition-colors hover:bg-accent/80 focus:outline-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ color: colorValue }}
          type="button" 
          aria-label="Select Mode"
          onClick={(e) => e.preventDefault()} // Prevent form submission
          disabled={disabled}
        >
          <ModeIcon className="h-5 w-5" />
          <span className="sr-only">Select Mode</span>
        </button>
      </ModeSelectorPopover>
      
      <AgentSelectorPopover disabled={disabled}>
        <SmartBarButton 
          icon={User}
          tooltip="Select Agent" 
          className="text-foreground"
          disabled={disabled}
        />
      </AgentSelectorPopover>

      <SmartBarFileButton disabled={disabled} />
    </div>
  );
}
