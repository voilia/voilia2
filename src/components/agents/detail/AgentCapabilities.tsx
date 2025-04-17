
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from "@/components/agents/types";
import { BrainCircuit, Sparkles, Code, Bot, MessageSquare, Layers, Zap, ChevronDown, ChevronUp, Plug, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface AgentCapabilitiesProps {
  agent: Agent;
}

export function AgentCapabilities({ agent }: AgentCapabilitiesProps) {
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);
  
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
          },
          {
            icon: MessageSquare,
            title: "Conversational",
            description: "Maintains context across multiple messages in a conversation"
          }
        ];
      case "tool":
        return [
          {
            icon: Plug,
            title: "Integrations",
            description: "Connects with external systems and data sources"
          },
          {
            icon: Play,
            title: "Automation",
            description: "Performs tasks with minimal human intervention"
          },
          {
            icon: Layers,
            title: "Structured Output",
            description: "Delivers responses in consistent, usable formats"
          }
        ];
      default:
        return [
          {
            icon: Bot,
            title: "AI Assistant",
            description: "Provides helpful responses to your questions"
          },
          {
            icon: MessageSquare,
            title: "Conversational",
            description: "Maintains context across multiple messages in a conversation"
          },
          {
            icon: Sparkles,
            title: "Specialized Knowledge",
            description: "Optimized for specific tasks with domain expertise"
          }
        ];
    }
  };

  const capabilities = getCapabilities();
  
  // Always show 3 capabilities (or all if less than 3)
  const visibleCapabilities = capabilities.slice(0, 3);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Capabilities</CardTitle>
        <CardDescription>What this agent can do for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Capabilities section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCapabilities.map((capability, index) => (
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
        
        {/* Example prompts section - collapsible */}
        <Collapsible 
          open={isPromptsOpen} 
          onOpenChange={setIsPromptsOpen}
          className="w-full"
        >
          <div className="flex items-center justify-between cursor-pointer py-2">
            <h3 className="text-lg font-medium">Example prompts</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isPromptsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <div className="mt-2 space-y-2">
              <Separator className="my-2" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-2 hover:bg-accent/10 rounded-md text-sm">
                  "Help me draft a professional email about project delays"
                </div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-2 hover:bg-accent/10 rounded-md text-sm">
                  "Generate 5 creative ideas for my marketing campaign"
                </div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-2 hover:bg-accent/10 rounded-md text-sm">
                  "Explain how this technology works to a non-technical person"
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
