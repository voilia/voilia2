
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
      <CardHeader className="pb-2">
        <CardTitle>Using {agent.name}</CardTitle>
        <CardDescription>How to integrate this agent in your workflows</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-3">
        <div className="flex-grow">
          <Tabs defaultValue="rooms">
            <TabsList className="mb-3">
              <TabsTrigger value="rooms">In Rooms</TabsTrigger>
              <TabsTrigger value="standalone">Standalone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rooms" className="space-y-3 min-h-[100px]">
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
            </TabsContent>
            
            <TabsContent value="standalone" className="space-y-3 min-h-[100px]">
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
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Button size="lg" className="w-full">
            Activate Agent
          </Button>
          <Button variant="outline" size="lg" className="w-full">
            Create Room with {agent.name}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
