
import { Label } from "@/components/ui/label";
import { AgentSelector } from "./AgentSelector";
import { ComingSoonMembers } from "./members/ComingSoonMembers";
import { ComingSoonBlueprint } from "./blueprint/ComingSoonBlueprint";
import { useAgents } from "@/hooks/useAgents";
import { useState, useEffect } from "react";

interface StepTwoProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAgentIds: string[];
  toggleAgentSelection?: (id: string) => void;
  showAllAgents: boolean;
  setShowAllAgents: (show: boolean) => void;
}

export function StepTwo({
  searchQuery,
  setSearchQuery,
  selectedAgentIds,
  toggleAgentSelection: externalToggleAgentSelection,
  showAllAgents,
  setShowAllAgents
}: StepTwoProps) {
  const { agents: allAgents, isLoading: isLoadingAgents, error } = useAgents();
  const [filteredAgents, setFilteredAgents] = useState(allAgents);
  
  // Handle agent selection internally if not provided
  const handleToggleAgentSelection = externalToggleAgentSelection || (() => {});
  
  // Filter agents based on search query
  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = allAgents.filter(
        agent => 
          agent.name.toLowerCase().includes(lowercaseQuery) || 
          agent.description.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredAgents(filtered);
    } else {
      setFilteredAgents(allAgents);
    }
  }, [searchQuery, allAgents]);
  
  // Calculate which agents to display (limit to 6 if not showing all)
  const visibleAgents = showAllAgents 
    ? filteredAgents 
    : filteredAgents.slice(0, 6);
  
  // Get only public agents for the selection badges
  const publicAgents = allAgents.filter(agent => agent.isPublic !== false);

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
          toggleAgentSelection={handleToggleAgentSelection}
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
