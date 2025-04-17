
import { MainLayout } from "@/app/layout/MainLayout";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { useAgentDetail } from "@/hooks/useAgentDetail";
import { AgentHeader } from "@/components/agents/detail/AgentHeader";
import { AgentCapabilities } from "@/components/agents/detail/AgentCapabilities";
import { AgentUsage } from "@/components/agents/detail/AgentUsage";
import { AgentNotFound } from "@/components/agents/detail/AgentNotFound";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

const AgentDetail = () => {
  const { agent, isLoading, error } = useAgentDetail();
  const isMobile = useIsMobile();

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <ContentContainer>
          <div className="animate-pulse space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-muted"></div>
              <div className="space-y-3 flex-1">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            </div>
            <div className="h-[300px] bg-muted rounded-xl"></div>
            <div className="h-[400px] bg-muted rounded-xl"></div>
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
        <div className="space-y-6">
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
          
          <Separator className="my-6" />
          
          {/* Main content section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent capabilities - takes 2/3 of the space on larger screens */}
            <div className="lg:col-span-2 space-y-6">
              <AgentCapabilities agent={agent} />
            </div>
            
            {/* Usage sidebar - takes 1/3 of the space on larger screens */}
            <div className="lg:col-span-1 space-y-6">
              <AgentUsage agent={agent} />
            </div>
          </div>
        </div>
      </ContentContainer>
    </MainLayout>
  );
};

export default AgentDetail;
