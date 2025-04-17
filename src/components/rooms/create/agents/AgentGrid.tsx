
import { Agent } from "@/components/agents/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentGridProps {
  agents: Agent[];
  selectedAgentIds: string[];
  onAgentSelect: (id: string) => void;
}

export function AgentGrid({ agents, selectedAgentIds, onAgentSelect }: AgentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className={cn(
            "border rounded-lg p-3 cursor-pointer transition-all",
            selectedAgentIds.includes(agent.id)
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
          onClick={() => onAgentSelect(agent.id)}
        >
          <div className="flex items-start gap-3">
            <div 
              className={cn(
                "rounded-full p-2 shrink-0",
                selectedAgentIds.includes(agent.id) 
                  ? "bg-primary/20 text-primary" 
                  : "bg-muted"
              )}
              style={{ 
                ...(agent.color && selectedAgentIds.includes(agent.id) 
                  ? { 
                    backgroundColor: `${agent.color}20`,
                    color: agent.color 
                  } 
                  : {})
              }}
            >
              {selectedAgentIds.includes(agent.id) ? (
                <Check className="h-4 w-4" />
              ) : (
                agent.icon && <agent.icon className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{agent.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {agent.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
