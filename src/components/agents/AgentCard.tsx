
import { useState } from "react";
import { Agent } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  
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
    <div 
      className={cn(
        "group relative flex flex-col justify-between h-[200px] rounded-xl border p-5",
        "transition-all duration-200 bg-white dark:bg-[#1a1a1a]",
        "hover:shadow-md hover:scale-[1.01] dark:hover:border-primary/30",
        "dark:border-white/5 dark:hover:bg-white/[0.02]"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div 
            className="rounded-full p-2 flex-shrink-0"
            style={{ 
              backgroundColor: `${agent.color}20`, // 20 = 12% opacity
              color: agent.color 
            }}
          >
            <AgentIcon className="h-5 w-5" />
          </div>
          
          {agent.badges && agent.badges.length > 0 && (
            <div className="flex gap-2">
              {agent.badges.map((badge) => (
                <Badge key={badge} variant={getBadgeVariant(badge)} className="text-xs">
                  {getBadgeLabel(badge)}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-medium text-lg line-clamp-1">{agent.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {agent.description}
          </p>
        </div>
      </div>
      
      <div className="pt-3">
        <HoverCard openDelay={300} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button 
              className="w-full"
              variant={isHovering ? "default" : "outline"}
            >
              Activate
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Activate {agent.name}</h4>
              <p className="text-sm text-muted-foreground">
                This agent will be available in all your rooms. You can select it when starting a new conversation.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}
