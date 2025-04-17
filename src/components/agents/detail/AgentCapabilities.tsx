
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from "@/components/agents/types";
import { BrainCircuit, Sparkles, Code, Bot, MessageSquare, Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentCapabilitiesProps {
  agent: Agent;
}

export function AgentCapabilities({ agent }: AgentCapabilitiesProps) {
  // Define capability data based on agent type
  const getCapabilities = () => {
    switch (agent.type) {
      case "llm":
        return [
          {
            icon: BrainCircuit,
            title: "Advanced Reasoning",
            description: "Handles complex questions with nuanced, thoughtful responses"
          },
          {
            icon: MessageSquare,
            title: "Conversational",
            description: "Maintains context across multiple messages in a conversation"
          },
          {
            icon: Code,
            title: "Code Generation",
            description: "Creates and explains code snippets across programming languages"
          }
        ];
      case "prompt":
        return [
          {
            icon: Sparkles,
            title: "Specialized Knowledge",
            description: "Optimized for specific tasks with domain expertise"
          },
          {
            icon: Layers,
            title: "Structured Output",
            description: "Delivers responses in consistent, usable formats"
          }
        ];
      case "tool":
        return [
          {
            icon: Zap,
            title: "Integrations",
            description: "Connects with external systems and data sources"
          },
          {
            icon: Bot,
            title: "Automation",
            description: "Performs tasks with minimal human intervention"
          }
        ];
      default:
        return [
          {
            icon: Bot,
            title: "AI Assistant",
            description: "Provides helpful responses to your questions"
          }
        ];
    }
  };

  const capabilities = getCapabilities();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capabilities</CardTitle>
        <CardDescription>What this agent can do for you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Capabilities section - now explicitly on the left */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {capabilities.map((capability, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/10 transition-colors"
                >
                  <div 
                    className="rounded-full p-2 flex-shrink-0"
                    style={{ 
                      backgroundColor: `${agent.color}20`,
                      color: agent.color 
                    }}
                  >
                    <capability.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{capability.title}</h3>
                    <p className="text-sm text-muted-foreground">{capability.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Example prompts - now consistently on the right with better styling */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="h-full p-4 rounded-lg border">
              <h3 className="text-sm font-medium mb-3 flex items-center justify-between">
                Example prompts
                <span className="text-xs text-muted-foreground">⌘ Click to use</span>
              </h3>
              <ul className="space-y-3">
                <li className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-2 hover:bg-accent/10 rounded-md">
                  "Help me draft a professional email about project delays"
                </li>
                <li className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-2 hover:bg-accent/10 rounded-md">
                  "Generate 5 creative ideas for my marketing campaign"
                </li>
                <li className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-2 hover:bg-accent/10 rounded-md">
                  "Explain how this technology works to a non-technical person"
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
