
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Agent } from "@/components/agents/types";
import { Check, Filter, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentSelectorProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  visibleAgents: Agent[];
  selectedAgentIds: string[];
  toggleAgentSelection: (id: string) => void;
  showAllAgents: boolean;
  setShowAllAgents: (show: boolean) => void;
  filteredAgents: Agent[];
  isLoadingAgents: boolean;
  publicAgents: Agent[];
}

export function AgentSelector({
  searchQuery,
  setSearchQuery,
  visibleAgents,
  selectedAgentIds,
  toggleAgentSelection,
  showAllAgents,
  setShowAllAgents,
  filteredAgents,
  isLoadingAgents,
  publicAgents
}: AgentSelectorProps) {
  if (isLoadingAgents) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search agents..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowAllAgents(true);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {visibleAgents.map((agent) => (
          <div
            key={agent.id}
            className={cn(
              "border rounded-lg p-3 cursor-pointer transition-all",
              selectedAgentIds.includes(agent.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => toggleAgentSelection(agent.id)}
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
      
      {/* Show more button */}
      {!showAllAgents && filteredAgents.length > 6 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => setShowAllAgents(true)}
        >
          Show All Agents ({filteredAgents.length})
        </Button>
      )}
      
      {/* Selected agents pills */}
      {selectedAgentIds.length > 0 && (
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-2">Selected ({selectedAgentIds.length}):</p>
          <div className="flex flex-wrap gap-2">
            {selectedAgentIds.map(id => {
              const agent = publicAgents.find(a => a.id === id);
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
                      toggleAgentSelection(id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Empty state for no matching agents */}
      {filteredAgents.length === 0 && (
        <div className="flex flex-col items-center justify-center p-6 border rounded-lg text-center space-y-2">
          <Filter className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No agents found</p>
            <p className="text-sm text-muted-foreground">Try a different search term</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery("")}
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
