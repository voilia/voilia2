import { Label } from "@/components/ui/label";
import { Agent } from "@/components/agents/types";
import { AgentSelector } from "./AgentSelector";
import { ComingSoonMembers } from "./members/ComingSoonMembers";
import { ComingSoonBlueprint } from "./blueprint/ComingSoonBlueprint";

interface StepTwoProps {
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

export function StepTwo({
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
}: StepTwoProps) {
  return (
    <div className="space-y-6 py-2">
      <ComingSoonMembers />
      
      <div className="space-y-3">
        <Label className="text-base font-medium">Select Agents (optional)</Label>
        <p className="text-sm text-muted-foreground -mt-1 mb-3">
          Choose the AI agents that will collaborate in this room
        </p>
        <AgentSelector
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          visibleAgents={visibleAgents}
          selectedAgentIds={selectedAgentIds}
          toggleAgentSelection={toggleAgentSelection}
          showAllAgents={showAllAgents}
          setShowAllAgents={setShowAllAgents}
          filteredAgents={filteredAgents}
          isLoadingAgents={isLoadingAgents}
          publicAgents={publicAgents}
        />
      </div>
      
      <ComingSoonBlueprint />
    </div>
  );
}
