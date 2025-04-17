
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
    <div className="space-y-5 py-4">
      <ComingSoonMembers />
      
      <div className="space-y-4">
        <Label>Select Agents (optional)</Label>
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
