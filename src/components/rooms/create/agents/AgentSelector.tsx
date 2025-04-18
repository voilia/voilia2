
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Agent } from "@/components/agents/types";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";
import { AgentGrid } from "./AgentGrid";
import { SelectedAgentBadges } from "./SelectedAgentBadges";
import { EmptyAgentsState } from "./EmptyAgentsState";

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
          id="agent-search"
          name="agent-search"
          aria-label="Search agents"
          placeholder="Search agents..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <AgentGrid 
        agents={visibleAgents}
        selectedAgentIds={selectedAgentIds}
        onAgentSelect={toggleAgentSelection}
      />
      
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
