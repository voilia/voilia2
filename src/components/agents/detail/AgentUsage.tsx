
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
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="rooms">In Rooms</TabsTrigger>
              <TabsTrigger value="standalone">Standalone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rooms" className="space-y-2 min-h-[80px]">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Add {agent.name} to any room by selecting it from the agent selector 
                  in the smart bar.
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Mention @{agent.name.toLowerCase().replace(/\s+/g, '_')} to 
                  target this agent in a multi-agent room.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="standalone" className="space-y-2 min-h-[80px]">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Create a dedicated room with only {agent.name} for focused work.
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  Use standalone mode from your dashboard to quickly access {agent.name}.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <Button size="lg" className="w-full h-12">
              Activate Agent
            </Button>
            <Button variant="outline" size="lg" className="w-full h-12">
              Create Room with {agent.name}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
