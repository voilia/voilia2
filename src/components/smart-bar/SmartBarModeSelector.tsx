
import React from "react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { SmartBarButton } from "./SmartBarButton";

export type SmartBarMode = "chat" | "visual" | "assist" | "vault";

interface SmartBarModeSelectorProps {
  selectedMode: SmartBarMode;
  onModeChange: (mode: SmartBarMode) => void;
  className?: string;
}

export function SmartBarModeSelector({
  selectedMode,
  onModeChange,
  className,
}: SmartBarModeSelectorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const getColors = () => {
    if (selectedMode === "chat") {
      return isDark ? "#9333EA" : "#8B5CF6";
    } else if (selectedMode === "visual") {
      return isDark ? "#FB923C" : "#F97316";
    } else if (selectedMode === "assist") {
      return isDark ? "#60A5FA" : "#3B82F6";
    } else if (selectedMode === "vault") {
      return isDark ? "#34D399" : "#10B981";
    }
    return "";
  };

  return (
    <SmartBarButton 
      icon={Brain}
      tooltip="Select Mode"
      className={cn(className, selectedMode === "chat" && "text-primary")}
      onClick={() => onModeChange("chat")}
      customColor={getColors()}
    />
  );
}
