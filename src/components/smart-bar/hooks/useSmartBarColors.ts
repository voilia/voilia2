
import { useTheme } from "@/components/ThemeProvider";
import type { SmartBarMode } from "../types/smart-bar-types";

export function useSmartBarColors() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getColors = (mode: SmartBarMode): string => {
    if (mode === "chat") {
      return isDark ? "#9333EA" : "#8B5CF6";
    } else if (mode === "visual") {
      return isDark ? "#FB923C" : "#F97316";
    } else if (mode === "assist") {
      return isDark ? "#60A5FA" : "#3B82F6";
    } else if (mode === "vault") {
      return isDark ? "#34D399" : "#10B981";
    }
    
    // Default fallback
    return isDark ? "#9333EA" : "#8B5CF6";
  };

  return { getColors };
}
