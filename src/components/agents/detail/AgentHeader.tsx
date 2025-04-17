
import { Agent } from "@/components/agents/types";
import { Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AgentHeaderProps {
  agent: Agent;
}

export function AgentHeader({ agent }: AgentHeaderProps) {
  const AgentIcon = agent.icon || Bot;
  
  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "popular":
        return "default";
      case "new":
        return "secondary";
      case "experimental":
        return "outline";
      case "internal":
        return "destructive";
      default:
        return "default";
    }
  };
  
  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case "popular":
        return "🔥 Popular";
      case "new":
        return "🆕 New";
      case "experimental":
        return "⚙️ Experimental";
      case "internal":
        return "💡 Internal";
      default:
        return badge;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div 
          className="rounded-full p-4 flex-shrink-0"
          style={{ 
            backgroundColor: `${agent.color}20`,
            color: agent.color 
          }}
        >
          <AgentIcon className="h-8 w-8" />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{agent.name}</h1>
            {agent.badges && agent.badges.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {agent.badges.map((badge) => (
                  <Badge key={badge} variant={getBadgeVariant(badge)}>
                    {getBadgeLabel(badge)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-2">
            <p className="text-lg text-muted-foreground">
              {agent.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
