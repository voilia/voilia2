
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
import { useState } from "react";

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
  disabled,
  ...props 
}: SmartBarButtonProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={disabled ? false : tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={variant}
            size={size}
            className={cn(
              "h-8 w-8",
              "bg-transparent hover:bg-accent/80 dark:hover:bg-white/10",
              "transition-all duration-200 active:scale-95",
              disabled && "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100",
              className
            )}
            style={customColor ? { color: customColor } : undefined}
            onMouseEnter={() => !disabled && setTooltipOpen(true)}
            onMouseLeave={() => !disabled && setTooltipOpen(false)}
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              setTooltipOpen(false);
              if (props.onClick && !disabled) props.onClick(e);
            }}
            disabled={disabled}
            {...props}
          >
            <Icon className="h-5 w-5" />
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
