
import { AgentCard } from "./AgentCard";
import { Agent } from "./types";
import { ViewMode } from "@/components/projects/types";
import { AgentListItem } from "./AgentListItem";
import { Bot } from "lucide-react"; // Added this import for the Bot icon

interface AgentListProps {
  agents: Agent[];
  isLoading: boolean;
  viewMode: ViewMode;
}

export function AgentList({ agents, isLoading, viewMode }: AgentListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="h-[200px] rounded-xl border bg-muted/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Bot className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No agents found</h3>
        <p className="text-muted-foreground max-w-sm">
          No agents match your search criteria. Try adjusting your search or check back later for new agents.
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {agents.map((agent) => (
        <AgentListItem key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
