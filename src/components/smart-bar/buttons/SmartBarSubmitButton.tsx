
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import type { SmartBarMode } from "../types/smart-bar-types";

interface SmartBarSubmitButtonProps {
  disabled: boolean;
  mode: SmartBarMode;
}

export function SmartBarSubmitButton({ disabled, mode }: SmartBarSubmitButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getButtonColor = () => {
    if (disabled) return "bg-muted/30";
    
    if (mode === "chat") {
      return isDark ? "bg-[#9333EA]/90" : "bg-[#8B5CF6]/90";
    } else if (mode === "visual") {
      return isDark ? "bg-[#FB923C]/90" : "bg-[#F97316]/90";
    } else if (mode === "assist") {
      return isDark ? "bg-[#60A5FA]/90" : "bg-[#3B82F6]/90";
    } else if (mode === "vault") {
      return isDark ? "bg-[#34D399]/90" : "bg-[#10B981]/90";
    }
  };

  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "rounded-lg h-8 w-8 flex items-center justify-center",
        "transition-all duration-200",
        "backdrop-blur-lg",
        "border border-white/10 dark:border-slate-700/30",
        "shadow-sm hover:shadow-md",
        disabled
          ? "cursor-not-allowed"
          : [
              getButtonColor(),
              "hover:opacity-90 hover:scale-[1.02]",
              "active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]",
            ]
      )}
      aria-label="Send message"
    >
      <ArrowUp className={cn(
        "h-4 w-4",
        disabled ? "text-muted-foreground/50" : "text-primary-foreground"
      )} />
    </button>
  );
}
