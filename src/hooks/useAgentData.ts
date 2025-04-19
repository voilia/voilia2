
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Agent, AgentType, AgentBadge } from "@/components/agents/types";
import { LucideIcon, Bot, Code, Brain, Gauge, MessageSquare, PenTool, Workflow } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

// Helper function to convert string to AgentType
const mapAgentType = (type: string | null): AgentType => {
  if (!type) return "prompt";

  switch (type.toLowerCase()) {
    case "llm": return "llm";
    case "tool": return "tool";
    case "moa": return "moa";
    case "shadow": return "shadow";
    default: return "prompt";
  }
};

// Helper function to convert string to LucideIcon
const mapIconToComponent = (iconName: string | null): LucideIcon => {
  switch (iconName?.toLowerCase()) {
    case "code": return Code;
    case "brain": return Brain;
    case "gauge": return Gauge;
    case "message-square": return MessageSquare;
    case "pen-tool": return PenTool;
    case "workflow": return Workflow;
    default: return Bot;
  }
};

// Helper to convert string[] to AgentBadge[]
const mapStringArrayToBadges = (tags: string[] | null): AgentBadge[] => {
  if (!tags) return [];
  
  return tags
    .filter(tag => ["popular", "new", "experimental", "internal"].includes(tag))
    .map(tag => tag as AgentBadge);
};

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
      description: agent.description || "",
      type: mapAgentType(agent.agent_type),
      icon: mapIconToComponent(agent.icon),
      color: agent.color || "#6E56CF",
      badges: mapStringArrayToBadges(agent.tags),
      isPublic: true
    }));
  }, []);

  const fetchAgentById = useCallback(async (id: string) => {
    const { data: agent, error } = await supabase
      .from('public_agents_with_meta')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
    
    if (!agent) return null;

    return {
      id: agent.id,
      name: agent.name,
      description: agent.description || "",
      type: mapAgentType(agent.agent_type),
      icon: mapIconToComponent(agent.icon),
      color: agent.color || "#6E56CF",
      badges: mapStringArrayToBadges(agent.tags),
      isPublic: true,
      system_prompt: agent.system_prompt,
      capabilities: agent.capabilities ? 
        (Array.isArray(agent.capabilities) ? 
          agent.capabilities.map(cap => typeof cap === 'string' ? cap : JSON.stringify(cap)) : 
          []
        ) : []
    } as Agent;
  }, []);

  return {
    fetchAgents,
    fetchAgentById
  };
}
