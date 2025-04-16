
import { Mic } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";

interface SmartBarVoiceButtonProps {
  className?: string;
}

export function SmartBarVoiceButton({ className }: SmartBarVoiceButtonProps) {
  return (
    <SmartBarButton 
      icon={Mic} 
      tooltip="Voice Input" 
      className={className}
    />
  );
}
