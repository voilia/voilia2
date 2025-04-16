
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
  ...props 
}: SmartBarButtonProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={variant}
            size={size}
            className={cn(
              "h-8 w-8",
              "bg-transparent hover:bg-accent/80 dark:hover:bg-white/10",
              "transition-all duration-200 active:scale-95",
              className
            )}
            style={customColor ? { color: customColor } : undefined}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            onClick={(e) => {
              setTooltipOpen(false);
              if (props.onClick) props.onClick(e);
            }}
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
