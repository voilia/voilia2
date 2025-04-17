
import { Agent } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AgentListItemProps {
  agent: Agent;
}

export function AgentListItem({ agent }: AgentListItemProps) {
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
        "flex items-center justify-between p-4 rounded-xl border",
        "modern-card",
        "hover:shadow-md hover:scale-[1.005] transition-all duration-300"
      )}
    >
      <Link 
        to={`/agents/${agent.id}`} 
        className="flex items-center gap-4 flex-1"
      >
        <div 
          className="rounded-full p-2 flex-shrink-0"
          style={{ 
            backgroundColor: `${agent.color}20`, // 20 = 12% opacity
            color: agent.color 
          }}
        >
          <AgentIcon className="h-5 w-5" />
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{agent.name}</h3>
            
            {agent.badges && agent.badges.length > 0 && (
              <div className="flex gap-1">
                {agent.badges.map((badge) => (
                  <Badge key={badge} variant={getBadgeVariant(badge)} className="text-xs">
                    {getBadgeLabel(badge)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {agent.description}
          </p>
        </div>
      </Link>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={(e) => {
          e.preventDefault();
          // Activation logic would go here
        }}
      >
        Activate
      </Button>
    </div>
  );
}
