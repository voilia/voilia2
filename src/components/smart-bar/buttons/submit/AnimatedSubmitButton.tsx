
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import type { SmartBarMode } from "../../types/smart-bar-types";

interface AnimatedSubmitButtonProps {
  disabled: boolean;
  mode: SmartBarMode;
  className?: string;
}

export function AnimatedSubmitButton({ disabled, mode, className }: AnimatedSubmitButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getButtonColor = () => {
    if (mode === "chat") {
      if (disabled) {
        return isDark ? "bg-[#D6BCFA]/80" : "bg-[#E9D5FF]/80";  // Light purple when disabled
      }
      return isDark ? "bg-[#9333EA]/90" : "bg-[#8B5CF6]/90";
    } else if (mode === "visual") {
      return disabled 
        ? (isDark ? "bg-orange-300/80" : "bg-orange-200/80")
        : (isDark ? "bg-[#FB923C]/90" : "bg-[#F97316]/90");
    } else if (mode === "assist") {
      return disabled 
        ? (isDark ? "bg-blue-300/80" : "bg-blue-200/80")
        : (isDark ? "bg-[#60A5FA]/90" : "bg-[#3B82F6]/90");
    } else if (mode === "vault") {
      return disabled 
        ? (isDark ? "bg-green-300/80" : "bg-green-200/80")
        : (isDark ? "bg-[#34D399]/90" : "bg-[#10B981]/90");
    }
    
    // Default fallback
    return isDark ? "bg-[#9333EA]/90" : "bg-[#8B5CF6]/90";
  };

  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "rounded-lg h-8 w-8 flex items-center justify-center",
        "transition-all duration-200",
        "shadow-sm backdrop-blur-lg",
        "border border-white/10 dark:border-slate-700/30",
        disabled
          ? "cursor-not-allowed hover:opacity-80"
          : [
              getButtonColor(),
              "hover:shadow-md hover:opacity-95",
              "active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]",
            ],
        className
      )}
      aria-label="Send message"
    >
      <ArrowUp className={cn(
        "h-4 w-4",
        disabled ? "text-muted-foreground/80" : "text-primary-foreground"
      )} />
    </button>
  );
}
