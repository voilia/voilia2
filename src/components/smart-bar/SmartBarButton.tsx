
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SmartBarButtonProps extends Omit<ButtonProps, "children"> {
  icon: LucideIcon;
  tooltip: string;
  customColor?: string;
}

export function SmartBarButton({ 
  icon: Icon, 
  tooltip, 
  variant = "ghost",
  size = "icon",
  className,
  customColor,
  ...props 
}: SmartBarButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={variant}
            size={size}
            className={cn(
              "h-8 w-8",
              "hover:bg-accent/80 dark:hover:bg-white/10",
              "transition-all duration-200 active:scale-95",
              className
            )}
            style={customColor ? { color: customColor } : undefined}
            {...props}
          >
            <Icon className="h-4 w-4 text-muted-foreground dark:text-neutral-300" />
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
