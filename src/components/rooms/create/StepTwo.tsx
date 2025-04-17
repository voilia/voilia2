
import { Label } from "@/components/ui/label";
import { AgentSelector } from "./agents/AgentSelector";
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
  const { agents: allAgents, isLoading: isLoadingAgents } = useAgents();
  const [filteredAgents, setFilteredAgents] = useState(allAgents);
  
  const handleToggleAgentSelection = externalToggleAgentSelection || (() => {});
  
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
  
  const visibleAgents = showAllAgents ? filteredAgents : filteredAgents.slice(0, 6);
  const publicAgents = allAgents.filter(agent => agent.isPublic !== false);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="p-1.5 bg-muted rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
            </svg>
          </div>
          <span className="text-sm">You'll be able to invite team members after creation</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">Select Agents <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <p className="text-sm text-muted-foreground -mt-1">
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
    </div>
  );
}
