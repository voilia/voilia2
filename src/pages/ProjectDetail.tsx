
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/app/layout/MainLayout";
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

  // Fetch project data
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

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Handle project loading error
  useEffect(() => {
    if (error) {
      console.error("Error loading project:", error);
      toast.error("Unable to load project details");
      navigate("/projects");
    }
  }, [error, navigate]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/projects" className="flex items-center gap-1">
                  <Folder className="h-4 w-4" />
                  <span>Projects</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isLoading ? "Loading..." : project?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Project Header */}
        <ProjectDetailHeader 
          project={project} 
          isLoading={isLoading} 
        />

        {/* Project Tabs */}
        <ProjectDetailTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />

        {/* Tab Content */}
        <div className="mt-2">
          {activeTab === "rooms" && <ProjectRoomsTab projectId={projectId!} />}
          {activeTab === "members" && <ProjectMembersTab projectId={projectId!} />}
          {activeTab === "settings" && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-xl font-medium mb-2">Settings coming soon...</h3>
              <p className="text-muted-foreground">Project settings functionality will be available in a future update.</p>
            </div>
          )}
          {activeTab === "analytics" && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-xl font-medium mb-2">Analytics coming soon...</h3>
              <p className="text-muted-foreground">Project analytics functionality will be available in a future update.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
