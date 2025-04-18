
import { ReactNode } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AgentSelectorPopoverProps {
  children: ReactNode;
  disabled?: boolean;
}

export function AgentSelectorPopover({ children, disabled }: AgentSelectorPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-80 p-4",
          "border border-white/20 dark:border-slate-700/30",
          "bg-white/90 dark:bg-background/90 backdrop-blur-lg",
          "shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
          "rounded-xl"
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
