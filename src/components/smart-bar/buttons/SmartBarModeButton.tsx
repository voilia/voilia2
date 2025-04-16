
import { Brain } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";

interface SmartBarModeButtonProps {
  className?: string;
}

export function SmartBarModeButton({ className }: SmartBarModeButtonProps) {
  return (
    <SmartBarButton 
      icon={Brain}
      tooltip="Chat Mode" 
      className={className}
    />
  );
}

