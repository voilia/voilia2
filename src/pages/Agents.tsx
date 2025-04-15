
import { useState } from "react";
import { MainLayout } from "@/app/layout/MainLayout";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { AgentList } from "@/components/agents/AgentList";
import { Search } from "@/components/Search";
import { useAgents } from "@/hooks/useAgents";
import { EmptyAgentsState } from "@/components/agents/EmptyAgentsState";
import { ViewToggle } from "@/components/agents/ViewToggle";
import { ViewMode } from "@/components/projects/types";

const Agents = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { agents, isLoading, error, searchQuery, setSearchQuery } = useAgents();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <MainLayout>
      <ContentContainer>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Agents</h1>
              <p className="text-muted-foreground mt-1">
                Discover powerful agents to use across your Rooms
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-start sm:items-center">
              <div className="w-full sm:w-auto">
                <Search 
                  onSearch={handleSearch} 
                  value={searchQuery} 
                  id="agent-search"
                  name="agent-search-query"
                  placeholder="Search Agents..."
                />
              </div>
            </div>
          </div>

          {agents.length > 0 ? (
            <>
              <div className="flex justify-end">
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
              <AgentList 
                agents={agents}
                isLoading={isLoading}
                viewMode={viewMode}
              />
            </>
          ) : (
            <EmptyAgentsState isLoading={isLoading} error={error} />
          )}
        </div>
      </ContentContainer>
    </MainLayout>
  );
};

export default Agents;
