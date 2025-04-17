
import React, { useState } from "react";
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
import { CreateRoomModal } from "@/components/rooms/CreateRoomModal";
import { toast } from "sonner";

interface NavActionButtonProps {
  type: "project" | "room" | "generic";
  isMobile: boolean;
  tooltipText?: string;
  projectId?: string;
}

export function NavActionButton({ type, isMobile, tooltipText, projectId }: NavActionButtonProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const buttonContainerStyles = cn(
    isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
    "absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-200"
  );

  // Handle project button
  if (type === "project") {
    return (
      <div className={buttonContainerStyles}>
        <CreateProjectDialog variant="icon" />
      </div>
    );
  }

  // Handle room button
  if (type === "room") {
    return (
      <div className={buttonContainerStyles}>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Create Room</span>
        </Button>
        <CreateRoomModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          initialProjectId={projectId}
        />
      </div>
    );
  }

  // For generic or unimplemented types
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tooltipText) {
      toast("This feature is coming soon!", {
        description: tooltipText
      });
    }
  };

  // For mobile or when no tooltip is needed
  if (isMobile) {
    return (
      <div className={buttonContainerStyles}>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleClick}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Desktop with tooltip
  return (
    <div className={buttonContainerStyles}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleClick}
            >
              <Plus className="h-4 w-4" />
            </Button>
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
