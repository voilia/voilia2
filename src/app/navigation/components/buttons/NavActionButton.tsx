
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

  // Handle project button separately
  if (type === "project") {
    return (
      <div className={buttonContainerStyles}>
        <CreateProjectDialog variant="icon" />
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tooltipText) {
      toast("This feature is coming soon!", {
        description: tooltipText
      });
    }
  };

  // Define button element that will be used in both mobile and desktop
  const buttonElement = (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={handleClick}
    >
      <Plus className="h-4 w-4" />
      <span className="sr-only">{tooltipText || "Action"}</span>
    </Button>
  );

  // For mobile, return a button without tooltip
  if (isMobile) {
    return (
      <div className={buttonContainerStyles}>
        {buttonElement}
      </div>
    );
  }

  // For desktop, use TooltipProvider
  return (
    <div className={buttonContainerStyles}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {buttonElement}
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
