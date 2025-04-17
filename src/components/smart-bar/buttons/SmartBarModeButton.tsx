
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
        "w-full flex items-center gap-2 justify-start p-2 hover:bg-accent/80",
        className
      )}
      style={{ color }}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
