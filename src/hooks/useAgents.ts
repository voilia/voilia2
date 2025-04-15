
import { useState, useEffect } from "react";
import { Agent } from "@/components/agents/types";
import { 
  Mail, 
  Search, 
  Bot, 
  Image, 
  Sparkles, 
  Zap, 
  Code, 
  MessageSquare 
} from "lucide-react";

// Mock data for demonstration
const mockAgents: Agent[] = [
  {
    id: "email-writer",
    name: "Email Writer",
    description: "Write professional emails for any context or audience with the perfect tone.",
    type: "prompt",
    badges: ["popular"],
    icon: Mail,
    color: "#9b87f5",
    isPublic: true
  },
  {
    id: "research-agent",
    name: "Research Agent",
    description: "Summarize and verify information from multiple web sources.",
    type: "tool",
    icon: Search,
    color: "#4caf50",
    isPublic: true
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    description: "Access Claude's powerful reasoning engine for complex tasks.",
    type: "llm",
    badges: ["new"],
    icon: MessageSquare,
    color: "#1eaedb",
    isPublic: true
  },
  {
    id: "visual-creator",
    name: "Visual Creator",
    description: "Generate images from text prompts with customizable styles.",
    type: "moa",
    icon: Image,
    color: "#ff9800",
    isPublic: true
  },
  {
    id: "shadow-optimizer",
    name: "Shadow Optimizer",
    description: "Automatically enhances prompts silently in the background.",
    type: "shadow",
    badges: ["internal"],
    icon: Sparkles,
    color: "#9c27b0",
    isPublic: false
  },
  {
    id: "code-assistant",
    name: "Code Assistant",
    description: "Generate, debug, and explain code in any programming language.",
    type: "prompt",
    icon: Code,
    color: "#2196f3",
    isPublic: true
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "OpenAI's latest multimodal model with enhanced reasoning.",
    type: "llm",
    badges: ["popular", "new"],
    icon: Bot,
    color: "#10a37f",
    isPublic: true
  },
  {
    id: "workflow-automator",
    name: "Workflow Automator",
    description: "Automate multi-step tasks across your projects and tools.",
    type: "tool",
    badges: ["experimental"],
    icon: Zap,
    color: "#ff5722",
    isPublic: true
  },
];

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Simulate loading agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setAgents(mockAgents);
        setFilteredAgents(mockAgents);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch agents'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

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
