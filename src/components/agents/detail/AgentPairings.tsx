
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from "@/components/agents/types";
import { RefreshCw, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentPairingsProps {
  agent: Agent;
}

export function AgentPairings({ agent }: AgentPairingsProps) {
  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          This agent pairs well with...
        </CardTitle>
        <CardDescription>
          Recommended agent combinations for optimal workflows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={cn(
            "flex items-center justify-center p-8 rounded-lg border-2 border-dashed", 
            "border-muted-foreground/20 bg-muted/30"
          )}
        >
          <div>
            <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <RefreshCw className="h-6 w-6 text-primary animate-[spin_3s_linear_infinite]" />
            </div>
            <h3 className="text-lg font-medium mb-2">Coming soon</h3>
            <p className="text-sm text-muted-foreground">
              VOILIA will suggest ideal teammates for this agent based on your workflows and common usage patterns.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

