
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/app/layout/MainLayout";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { ProjectDetailHeader } from "@/components/projects/detail/ProjectDetailHeader";
import { ProjectDetailTabs } from "@/components/projects/detail/ProjectDetailTabs";
import { ProjectRoomsTab } from "@/components/projects/detail/ProjectRoomsTab";
import { ProjectMembersTab } from "@/components/projects/detail/ProjectMembersTab";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Folder } from "lucide-react";

type TabType = "rooms" | "members" | "settings" | "analytics";

const ProjectDetail = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("rooms");

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("is_deleted", false)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (error) {
      console.error("Error loading project:", error);
      toast.error("Unable to load project details");
      navigate("/projects");
    }
  }, [error, navigate]);

  return (
    <MainLayout>
      <ContentContainer>
        <div className="flex flex-col gap-4 md:gap-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/projects">
                    <div className="flex items-center gap-1">
                      <Folder className="h-4 w-4" />
                      <span>Projects</span>
                    </div>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{isLoading ? "Loading..." : project?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <ProjectDetailHeader 
            project={project} 
            isLoading={isLoading} 
          />

          <ProjectDetailTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />

          <div className="mt-2 md:mt-4">
            {activeTab === "rooms" && <ProjectRoomsTab projectId={projectId!} />}
            {activeTab === "members" && <ProjectMembersTab projectId={projectId!} />}
            {activeTab === "settings" && (
              <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
                <h3 className="text-xl font-medium mb-2">Settings coming soon...</h3>
                <p className="text-muted-foreground max-w-md">Project settings functionality will be available in a future update.</p>
              </div>
            )}
            {activeTab === "analytics" && (
              <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
                <h3 className="text-xl font-medium mb-2">Analytics coming soon...</h3>
                <p className="text-muted-foreground max-w-md">Project analytics functionality will be available in a future update.</p>
              </div>
            )}
          </div>
        </div>
      </ContentContainer>
    </MainLayout>
  );
};

export default ProjectDetail;
