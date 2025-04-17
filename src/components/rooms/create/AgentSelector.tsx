
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Agent } from "@/components/agents/types";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";
import { AgentGrid } from "./agents/AgentGrid";
import { SelectedAgentBadges } from "./agents/SelectedAgentBadges";
import { EmptyAgentsState } from "./agents/EmptyAgentsState";

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
      <div className="flex items-center justify-center p-10">
        <Loader className="mr-2" />
        <span className="text-muted-foreground">Loading agents...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <AgentGrid 
        agents={visibleAgents}
        selectedAgentIds={selectedAgentIds}
        onAgentSelect={toggleAgentSelection}
      />
      
      {!showAllAgents && filteredAgents.length > 6 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={() => setShowAllAgents(true)}
        >
          Show All Agents ({filteredAgents.length})
        </Button>
      )}
      
      <SelectedAgentBadges 
        selectedAgentIds={selectedAgentIds}
        agents={publicAgents}
        onDeselect={toggleAgentSelection}
      />
      
      {filteredAgents.length === 0 && (
        <EmptyAgentsState onClear={() => setSearchQuery("")} />
      )}
    </div>
  );
}
