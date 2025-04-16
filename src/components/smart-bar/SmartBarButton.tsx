
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";

interface SmartBarButtonProps extends Omit<ButtonProps, "children"> {
  icon: LucideIcon;
  tooltip: string;
}

export function SmartBarButton({ 
  icon: Icon, 
  tooltip, 
  variant = "ghost",
  size = "icon",
  className,
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
            className="h-8 w-8"
            {...props}
          >
            <Icon className="h-4 w-4" />
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
