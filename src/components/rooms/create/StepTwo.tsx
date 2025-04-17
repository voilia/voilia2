
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Agent } from "@/components/agents/types";
import { AgentSelector } from "./AgentSelector";

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
      {/* Add Members (Coming Soon) */}
      <div className="space-y-2 opacity-60">
        <Label className="flex items-center gap-2" htmlFor="members">
          Add Members
          <Badge variant="outline" className="text-xs">Coming Soon</Badge>
        </Label>
        <div className="p-3 border rounded-lg bg-muted/50 text-sm text-muted-foreground">
          You'll be able to invite collaborators after Room creation
        </div>
      </div>
      
      {/* Select Agents */}
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
      
      {/* Coming Soon Features */}
      {/* Blueprint Selection */}
      <div className="space-y-2 opacity-60">
        <Label className="flex items-center gap-2" htmlFor="blueprint">
          Start from Blueprint
          <Badge variant="outline" className="text-xs">Coming Soon</Badge>
        </Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Choose a blueprint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="disabled">Choose a blueprint</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
