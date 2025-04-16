
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
        return isDark ? "bg-[#D6BCFA]" : "bg-[#E9D5FF]";  // Light purple when disabled
      }
      return isDark ? "bg-[#9333EA]" : "bg-[#8B5CF6]";
    } else if (mode === "visual") {
      return disabled 
        ? (isDark ? "bg-orange-300" : "bg-orange-200")
        : (isDark ? "bg-[#FB923C]" : "bg-[#F97316]");
    } else if (mode === "assist") {
      return disabled 
        ? (isDark ? "bg-blue-300" : "bg-blue-200")
        : (isDark ? "bg-[#60A5FA]" : "bg-[#3B82F6]");
    } else if (mode === "vault") {
      return disabled 
        ? (isDark ? "bg-green-300" : "bg-green-200")
        : (isDark ? "bg-[#34D399]" : "bg-[#10B981]");
    }
    
    // Default fallback
    return isDark ? "bg-[#9333EA]" : "bg-[#8B5CF6]";
  };

  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "rounded-full h-8 w-8 flex items-center justify-center",
        "transition-all duration-200",
        "shadow-sm hover:shadow-md",
        disabled
          ? "cursor-not-allowed hover:opacity-90"
          : [
              getButtonColor(),
              "hover:opacity-90 hover:scale-105",
            ],
        className
      )}
      aria-label="Send message"
    >
      <ArrowUp className={cn(
        "h-4 w-4",
        disabled ? "text-muted-foreground" : "text-primary-foreground"
      )} />
    </button>
  );
}

