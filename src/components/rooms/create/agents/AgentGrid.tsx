
import { Agent } from "@/components/agents/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface AgentGridProps {
  agents: Agent[];
  selectedAgentIds: string[];
  onAgentSelect: (id: string) => void;
}

export function AgentGrid({ agents, selectedAgentIds, onAgentSelect }: AgentGridProps) {
  if (agents.length === 0) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {agents.map(agent => {
        const isSelected = selectedAgentIds.includes(agent.id);
        return (
          <div
            key={agent.id}
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md flex items-start gap-3 group",
              isSelected 
                ? "border-primary bg-primary/5 ring-1 ring-primary" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onAgentSelect(agent.id)}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white",
              isSelected ? "bg-primary" : "bg-muted"
            )}>
              {isSelected ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-lg font-medium text-muted-foreground">
                  {agent.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate mb-1">{agent.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {agent.description || "No description provided"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
