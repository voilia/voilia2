
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
  const colorValue = getColors(mode);

  return (
    <SmartBarButton 
      icon={Brain}
      tooltip="Select Mode"
      className={cn(className)}
      onClick={() => setMode(mode === "chat" ? "visual" : "chat")}
      customColor={colorValue}
    />
  );
}
