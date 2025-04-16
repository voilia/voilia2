
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
    <div className={cn("flex items-center gap-1", className)}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;
        
        let bgColorClass = "";
        let textColorClass = "";
        
        if (isSelected) {
          if (mode.id === "chat") {
            bgColorClass = isDark ? "bg-[#9333EA]/20" : "bg-[#8B5CF6]/20";
            textColorClass = isDark ? "text-[#9333EA]" : "text-[#8B5CF6]";
          } else if (mode.id === "visual") {
            bgColorClass = isDark ? "bg-[#FB923C]/20" : "bg-[#F97316]/20";
            textColorClass = isDark ? "text-[#FB923C]" : "text-[#F97316]";
          } else if (mode.id === "assist") {
            bgColorClass = isDark ? "bg-[#60A5FA]/20" : "bg-[#3B82F6]/20";
            textColorClass = isDark ? "text-[#60A5FA]" : "text-[#3B82F6]";
          } else if (mode.id === "vault") {
            bgColorClass = isDark ? "bg-[#34D399]/20" : "bg-[#10B981]/20";
            textColorClass = isDark ? "text-[#34D399]" : "text-[#10B981]";
          }
        }
        
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg",
              "transition-all duration-200 hover:bg-accent",
              bgColorClass,
              isSelected && textColorClass
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
