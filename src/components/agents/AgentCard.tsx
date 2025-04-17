
import { useState } from "react";
import { Agent } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        "group relative flex flex-col justify-between",
        "w-full max-w-[300px] h-[280px]",
        "rounded-xl border p-5",
        "modern-card",
        "hover:shadow-lg hover:-translate-y-1",
        "dark:hover:border-primary/30",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div 
            className="rounded-full p-2 flex-shrink-0"
            style={{ 
              backgroundColor: `${agent.color}20`,
              color: agent.color 
            }}
          >
            <AgentIcon className="h-5 w-5" />
          </div>
          
          {agent.badges && agent.badges.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-end">
              {agent.badges.map((badge) => (
                <Badge key={badge} variant={getBadgeVariant(badge)} className="text-xs whitespace-nowrap">
                  {getBadgeLabel(badge)}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-2">{agent.name}</h3>
          <p 
            className={cn(
              "text-sm text-muted-foreground",
              "line-clamp-3 min-h-[4.2em]",
              "display-webkit-box webkit-line-clamp-3 webkit-box-orient-vertical"
            )}
          >
            {agent.description}
          </p>
        </div>
      </div>
      
      <div className="pt-4 pb-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className={cn(
                  "w-full transition-all duration-300",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "shadow-sm hover:shadow-md"
                )}
                variant={isHovering ? "default" : "outline"}
                aria-label={`Activate ${agent.name}`}
              >
                Activate
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="z-[60]"
              sideOffset={8}
            >
              <p>Activate {agent.name}</p>
              <p className="text-xs text-muted-foreground">
                Available in all your rooms
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
