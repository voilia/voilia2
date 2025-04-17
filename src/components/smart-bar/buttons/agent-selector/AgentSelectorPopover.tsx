
import { ReactNode } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AgentSelectorPopoverProps {
  children: ReactNode;
  disabled?: boolean; // Add disabled prop to interface
}

export function AgentSelectorPopover({ children, disabled }: AgentSelectorPopoverProps) {
  // Use disabled to conditionally control popover open state
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-80 p-4",
          "border border-border",
          "bg-background/95 backdrop-blur-sm"
        )}
        align="start"
      >
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Select Agents</h3>
          <p className="text-xs text-muted-foreground">
            Choose which agents to use for this conversation.
          </p>
          
          {/* Agent selection UI would go here */}
          <div className="py-2 text-sm text-muted-foreground italic">
            Agent selection coming soon...
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
