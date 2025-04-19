
import { useState, useEffect } from "react";
import { Agent } from "@/components/agents/types";
import { useParams } from "react-router-dom";
import { useAgentData } from "./useAgentData";

export function useAgentDetail() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { fetchAgentById } = useAgentData();

  useEffect(() => {
    const fetchAgentDetail = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const fetchedAgent = await fetchAgentById(id);
        setAgent(fetchedAgent);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch agent details'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentDetail();
  }, [id, fetchAgentById]);

  return {
    agent,
    isLoading,
    error
  };
}
