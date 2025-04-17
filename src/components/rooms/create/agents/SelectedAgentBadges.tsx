
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Agent } from "@/components/agents/types";

interface SelectedAgentBadgesProps {
  selectedAgentIds: string[];
  agents: Agent[];
  onDeselect: (id: string) => void;
}

export function SelectedAgentBadges({ selectedAgentIds, agents, onDeselect }: SelectedAgentBadgesProps) {
  if (selectedAgentIds.length === 0) return null;

  return (
    <div className="pt-3 bg-card rounded-lg p-3 border mt-3">
      <p className="text-sm font-medium text-muted-foreground mb-2">Selected Agents ({selectedAgentIds.length})</p>
      <div className="flex flex-wrap gap-2">
        {selectedAgentIds.map(id => {
          const agent = agents.find(a => a.id === id);
          return agent && (
            <Badge 
              key={id} 
              variant="secondary"
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-full"
            >
              <span>{agent.name}</span>
              <button
                className="hover:bg-accent rounded-full p-0.5 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeselect(id);
                }}
                aria-label={`Remove ${agent.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
