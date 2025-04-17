
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from "@/components/agents/types";
import { BrainCircuit, Sparkles, Code, Bot, MessageSquare, Layers, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AgentCapabilitiesProps {
  agent: Agent;
}

export function AgentCapabilities({ agent }: AgentCapabilitiesProps) {
  const [isOpen, setIsOpen] = useState(false);
  
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
  
  // Only show some capabilities when collapsed
  const visibleCapabilities = isOpen ? capabilities : capabilities.slice(0, 2);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Capabilities</CardTitle>
            <CardDescription>What this agent can do for you</CardDescription>
          </div>
          <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Capabilities section - left side */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              
              {/* Show more capabilities toggle for small devices */}
              {capabilities.length > 2 && !isOpen && (
                <div className="mt-2 lg:hidden">
                  <CollapsibleTrigger asChild onClick={() => setIsOpen(true)}>
                    <Button variant="ghost" size="sm" className="text-muted-foreground text-sm">
                      Show {capabilities.length - 2} more capabilities
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              )}
              
              <CollapsibleContent>
                {capabilities.length > 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {capabilities.slice(2).map((capability, index) => (
                      <div 
                        key={index + 2} 
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
                )}
              </CollapsibleContent>
            </div>
            
            {/* Example prompts - right side, better positioned */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="h-full p-4 rounded-lg border">
                <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
                  Example prompts
                  <span className="text-xs text-muted-foreground">⌘ Click to use</span>
                </h3>
                <ul className="space-y-2">
                  <li className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-2 hover:bg-accent/10 rounded-md text-sm">
                    "Help me draft a professional email about project delays"
                  </li>
                  <li className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-2 hover:bg-accent/10 rounded-md text-sm">
                    "Generate 5 creative ideas for my marketing campaign"
                  </li>
                  <li className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-2 hover:bg-accent/10 rounded-md text-sm">
                    "Explain how this technology works to a non-technical person"
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
