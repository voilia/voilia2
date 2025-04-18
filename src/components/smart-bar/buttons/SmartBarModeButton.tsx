
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SmartBarModeButtonProps {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick: () => void;
  className?: string;
}

export function SmartBarModeButton({ 
  icon: Icon,
  label,
  color,
  onClick,
  className 
}: SmartBarModeButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 justify-start py-2 px-3 rounded-lg",
        "transition-all duration-200",
        "hover:bg-white/40 dark:hover:bg-slate-800/50",
        "active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)]",
        className
      )}
      style={{ color }}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
