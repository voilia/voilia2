
import { Mic } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";
import { cn } from "@/lib/utils";

interface SmartBarVoiceButtonProps {
  className?: string;
}

export function SmartBarVoiceButton({ className }: SmartBarVoiceButtonProps) {
  return (
    <SmartBarButton 
      icon={Mic} 
      tooltip="Voice Input" 
      className={cn("", className)}
    />
  );
}
