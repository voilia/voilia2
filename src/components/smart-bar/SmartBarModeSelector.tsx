
import { Brain } from "lucide-react";
import { SmartBarButton } from "./SmartBarButton";
import { useSmartBarColors } from "./hooks/useSmartBarColors";
import { useSmartBar } from "./context/SmartBarContext";
import { cn } from "@/lib/utils";

interface SmartBarModeSelectorProps {
  className?: string;
}

export function SmartBarModeSelector({ className }: SmartBarModeSelectorProps) {
  const { mode, setMode } = useSmartBar();
  const { getColors } = useSmartBarColors();

  return (
    <SmartBarButton 
      icon={Brain}
      tooltip="Select Mode"
      className={cn(className, mode === "chat" && "text-primary")}
      onClick={() => setMode("chat")}
      customColor={getColors(mode)}
    />
  );
}
