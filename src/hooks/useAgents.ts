
import { useState, useEffect } from "react";
import { Agent } from "@/components/agents/types";
import { useAgentData } from "./useAgentData";

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { fetchAgents } = useAgentData();

  // Fetch agents from Supabase
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        const fetchedAgents = await fetchAgents();
        setAgents(fetchedAgents);
        setFilteredAgents(fetchedAgents);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch agents'));
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, [fetchAgents]);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        const lowercaseQuery = searchQuery.toLowerCase();
        const filtered = agents.filter(
          agent => 
            agent.name.toLowerCase().includes(lowercaseQuery) || 
            agent.description.toLowerCase().includes(lowercaseQuery)
        );
        setFilteredAgents(filtered);
      } else {
        setFilteredAgents(agents);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, agents]);

  return {
    agents: filteredAgents,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
  };
}
