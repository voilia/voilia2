
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from "@/components/agents/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Capabilities</CardTitle>
        <CardDescription>What this agent can do for you</CardDescription>
      </CardHeader>
      <CardContent>
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
        
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="example-prompts">
            <AccordionTrigger>Example prompts</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 list-disc pl-6">
                <li className="text-muted-foreground hover:text-foreground cursor-pointer">
                  "Help me draft a professional email about project delays"
                </li>
                <li className="text-muted-foreground hover:text-foreground cursor-pointer">
                  "Generate 5 creative ideas for my marketing campaign"
                </li>
                <li className="text-muted-foreground hover:text-foreground cursor-pointer">
                  "Explain how this technology works to a non-technical person"
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
