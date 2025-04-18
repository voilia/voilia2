
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
        "h-[2px] rounded-full shadow-sm",
        mode === "chat" && (isDark ? "bg-[#9333EA]/90" : "bg-[#8B5CF6]/90"),
        mode === "visual" && (isDark ? "bg-[#FB923C]/90" : "bg-[#F97316]/90"),
        mode === "assist" && (isDark ? "bg-[#60A5FA]/90" : "bg-[#3B82F6]/90"),
        mode === "vault" && (isDark ? "bg-[#34D399]/90" : "bg-[#10B981]/90"),
        className
      )}
      aria-hidden="true"
    />
  );
}
