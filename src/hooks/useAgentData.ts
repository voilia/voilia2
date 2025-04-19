
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Agent } from "@/components/agents/types";

export function useAgentData() {
  const fetchAgents = useCallback(async () => {
    const { data: agents, error } = await supabase
      .from('public_agents_with_meta')
      .select('*');
    
    if (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }

    return agents.map((agent): Agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.agent_type,
      icon: agent.icon,
      color: agent.color,
      badges: agent.tags,
      isPublic: true
    }));
  }, []);

  const fetchAgentById = useCallback(async (id: string) => {
    const { data: agents, error } = await supabase
      .from('public_agents_with_meta')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
    
    if (!agents) return null;

    return {
      id: agents.id,
      name: agents.name,
      description: agents.description,
      type: agents.agent_type,
      icon: agents.icon,
      color: agents.color,
      badges: agents.tags,
      isPublic: true,
      system_prompt: agents.system_prompt,
      capabilities: agents.capabilities
    } as Agent;
  }, []);

  return {
    fetchAgents,
    fetchAgentById
  };
}
