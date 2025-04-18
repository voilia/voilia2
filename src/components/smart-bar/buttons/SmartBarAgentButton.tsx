
import { User } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";
import { AgentSelectorPopover } from "./agent-selector/AgentSelectorPopover";

interface SmartBarAgentButtonProps {
  className?: string;
  disabled?: boolean;
}

export function SmartBarAgentButton({ className, disabled }: SmartBarAgentButtonProps) {
  return (
    <AgentSelectorPopover disabled={disabled}>
      <SmartBarButton 
        icon={User}
        tooltip="Select Agent" 
        className={className}
        disabled={disabled}
      />
    </AgentSelectorPopover>
  );
}
