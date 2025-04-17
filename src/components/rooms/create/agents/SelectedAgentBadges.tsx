
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
    <div className="pt-2">
      <p className="text-sm text-muted-foreground mb-2">Selected ({selectedAgentIds.length}):</p>
      <div className="flex flex-wrap gap-2">
        {selectedAgentIds.map(id => {
          const agent = agents.find(a => a.id === id);
          return agent && (
            <Badge 
              key={id} 
              variant="outline"
              className="flex items-center gap-1 pr-1"
            >
              <span>{agent.name}</span>
              <button
                className="hover:bg-accent rounded-full p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeselect(id);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
