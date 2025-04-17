
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from "@/components/agents/types";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentUsageProps {
  agent: Agent;
}

export function AgentUsage({ agent }: AgentUsageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Using {agent.name}</CardTitle>
        <CardDescription>How to integrate this agent in your workflows</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rooms">
          <TabsList className="mb-4">
            <TabsTrigger value="rooms">In Rooms</TabsTrigger>
            <TabsTrigger value="standalone">Standalone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Add {agent.name} to any room by selecting it from the agent selector 
                  in the smart bar. Once added, it will be available in that room's conversation.
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Mention @{agent.name.toLowerCase().replace(/\s+/g, '_')} in your prompt to 
                  specifically target this agent in a multi-agent room.
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  This agent works best in combination with research agents for fact-checking
                  and data analysis tools for visualization.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="standalone">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Create a dedicated room with only {agent.name} for focused work sessions.
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Use the standalone mode from your dashboard to quickly access {agent.name} 
                  without creating a new room.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="w-full sm:w-auto">
            Activate Agent
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Create Room with {agent.name}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
