
import { MainLayout } from "@/app/layout/MainLayout";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { useAgentDetail } from "@/hooks/useAgentDetail";
import { AgentHeader } from "@/components/agents/detail/AgentHeader";
import { AgentCapabilities } from "@/components/agents/detail/AgentCapabilities";
import { AgentUsage } from "@/components/agents/detail/AgentUsage";
import { AgentNotFound } from "@/components/agents/detail/AgentNotFound";
import { AgentPairings } from "@/components/agents/detail/AgentPairings";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const AgentDetail = () => {
  const { agent, isLoading, error } = useAgentDetail();

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <ContentContainer>
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agents" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Agents
              </Link>
            </Button>
          </div>
          <div className="animate-pulse space-y-8 flex flex-col items-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-3 w-full max-w-md">
                <Skeleton className="h-8 w-1/3 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-full mx-auto" />
              </div>
            </div>
            <Separator className="my-6 w-full" />
            <div className="grid grid-cols-1 gap-6 w-full max-w-screen-lg">
              <Skeleton className="h-[300px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[150px] rounded-xl" />
            </div>
          </div>
        </ContentContainer>
      </MainLayout>
    );
  }

  // Error or not found state
  if (error || !agent) {
    return (
      <MainLayout>
        <ContentContainer>
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agents" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Agents
              </Link>
            </Button>
          </div>
          <AgentNotFound />
        </ContentContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ContentContainer>
        <div className="max-w-screen-lg mx-auto">
          {/* Back button */}
          <div className="mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agents" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Agents
              </Link>
            </Button>
          </div>
          
          {/* Agent header */}
          <AgentHeader agent={agent} />
          
          <Separator className="my-5" />
          
          {/* Main content section with better spacing */}
          <div className="space-y-5">
            {/* Capabilities section first */}
            <AgentCapabilities agent={agent} />
            
            {/* Usage section directly below with minimal spacing */}
            <AgentUsage agent={agent} />
            
            {/* Agent pairings section */}
            <AgentPairings agent={agent} />
          </div>
        </div>
      </ContentContainer>
    </MainLayout>
  );
}

export default AgentDetail;
