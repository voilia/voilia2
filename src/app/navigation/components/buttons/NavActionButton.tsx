
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { toast } from "sonner";

interface NavActionButtonProps {
  type: "project" | "room" | "generic";
  isMobile: boolean;
  tooltipText?: string;
}

export function NavActionButton({ type, isMobile, tooltipText }: NavActionButtonProps) {
  const buttonContainerStyles = cn(
    isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
    "absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-200"
  );

  if (type === "project") {
    return (
      <div className={buttonContainerStyles}>
        <CreateProjectDialog variant="icon" />
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Show toast with the tooltip text instead of trying to set title property on a ReactNode
    if (tooltipText) {
      toast({
        title: tooltipText,
        description: "This feature is coming soon!"
      });
    }
  };

  const actionButton = (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={handleClick}
    >
      <Plus className="h-4 w-4" />
      <span className="sr-only">{tooltipText}</span>
    </Button>
  );

  if (isMobile) {
    return <div className={buttonContainerStyles}>{actionButton}</div>;
  }

  return (
    <div className={buttonContainerStyles}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {actionButton}
          </TooltipTrigger>
          <TooltipContent 
            side="right"
            className="bg-secondary text-secondary-foreground"
          >
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
