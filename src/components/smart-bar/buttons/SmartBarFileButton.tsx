
import { Paperclip } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";

interface SmartBarFileButtonProps {
  className?: string;
}

export function SmartBarFileButton({ className }: SmartBarFileButtonProps) {
  return (
    <SmartBarButton 
      icon={Paperclip}
      tooltip="Upload File" 
      className={className}
    />
  );
}

