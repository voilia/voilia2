
import { useState, useEffect } from "react";
import { Agent } from "@/components/agents/types";
import { useParams } from "react-router-dom";
import { useAgents } from "./useAgents";

export function useAgentDetail() {
  const { id } = useParams<{ id: string }>();
  const { agents, isLoading: isLoadingAllAgents } = useAgents();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAgentDetail = async () => {
      try {
        setIsLoading(true);
        
        // First try to find the agent in the already loaded agents
        if (agents.length > 0) {
          const foundAgent = agents.find(a => a.id === id);
          if (foundAgent) {
            setAgent(foundAgent);
            setIsLoading(false);
            return;
          }
        }
        
        // If not found or agents not loaded yet, wait for them
        if (isLoadingAllAgents) {
          return;
        }
        
        // If agents loaded but requested ID not found, set error
        if (!isLoadingAllAgents && agents.length > 0 && !agents.find(a => a.id === id)) {
          throw new Error(`Agent with ID ${id} not found`);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch agent details'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentDetail();
  }, [id, agents, isLoadingAllAgents]);

  return {
    agent,
    isLoading,
    error
  };
}
