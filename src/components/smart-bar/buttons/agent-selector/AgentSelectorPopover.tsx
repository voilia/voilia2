
import { useAgents } from "@/hooks/useAgents";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AgentSelectorPopover({ children }: { children: React.ReactNode }) {
  const { agents } = useAgents();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-2 grid grid-cols-2 sm:grid-cols-3 gap-2" 
        align="start"
        sideOffset={5}
      >
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgents.includes(agent.id);
          
          return (
            <button
              key={agent.id}
              onClick={() => toggleAgent(agent.id)}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg",
                "transition duration-300 hover:bg-accent",
                isSelected && "bg-accent/50"
              )}
            >
              {Icon && <Icon className="w-5 h-5 mb-1" style={{ color: agent.color }} />}
              <span className="text-sm font-medium">{agent.name}</span>
            </button>
          )}
        )}
      </PopoverContent>
    </Popover>
  );
}
