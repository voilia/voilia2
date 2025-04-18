
import { cn } from "@/lib/utils";
import type { SmartBarMode } from "../../types/smart-bar-types";
import { useTheme } from "@/components/ThemeProvider";

interface ColoredModeIndicatorProps {
  mode: SmartBarMode;
  className?: string;
}

export function ColoredModeIndicator({ mode, className }: ColoredModeIndicatorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div 
      className={cn(
        "transition-all duration-300",
        "h-[2px]",
        mode === "chat" && (isDark ? "bg-[#9333EA]" : "bg-[#8B5CF6]"),
        mode === "visual" && (isDark ? "bg-[#FB923C]" : "bg-[#F97316]"),
        mode === "assist" && (isDark ? "bg-[#60A5FA]" : "bg-[#3B82F6]"),
        mode === "vault" && (isDark ? "bg-[#34D399]" : "bg-[#10B981]"),
        className
      )}
      aria-hidden="true"
    />
  );
}
