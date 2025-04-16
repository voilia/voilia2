
import React from "react";
import { Brain, Image, Bot, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

export type SmartBarMode = "chat" | "visual" | "assist" | "vault";

interface SmartBarModeItem {
  id: SmartBarMode;
  icon: React.ElementType;
  label: string;
}

const modes: SmartBarModeItem[] = [
  { id: "chat", icon: Brain, label: "Chat" },
  { id: "visual", icon: Image, label: "Visual" },
  { id: "assist", icon: Bot, label: "Assist" },
  { id: "vault", icon: Database, label: "Vault" },
];

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

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;
        const colorKey = `bg-smartbar-${mode.id}-${isDark ? "dark" : "light"}`;
        const textColorKey = `text-smartbar-${mode.id}-${isDark ? "dark" : "light"}`;
        
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg",
              "transition-all duration-200 hover:bg-accent",
              isSelected && `${colorKey}/20`,
              isSelected && textColorKey
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
