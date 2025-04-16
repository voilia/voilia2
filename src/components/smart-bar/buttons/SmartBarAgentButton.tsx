
import { User } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";

interface SmartBarAgentButtonProps {
  className?: string;
}

export function SmartBarAgentButton({ className }: SmartBarAgentButtonProps) {
  return (
    <SmartBarButton 
      icon={User}
      tooltip="Select Agent" 
      className={className}
    />
  );
}
