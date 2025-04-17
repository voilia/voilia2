
import { useState, useEffect } from "react";
import { MainLayout } from "@/app/layout/MainLayout";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { useProjects } from "@/hooks/useProjects";
import { EmptyProjectsState } from "@/components/projects/EmptyProjectsState";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ViewToggle, ViewMode, SortOption } from "@/components/projects/ViewToggle";
import { Search } from "@/components/Search";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const Projects = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOption, setSortOption] = useState<SortOption>("updated_at");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  
  const { projects, isLoading, error, refreshProjects } = useProjects();

  // Effect to handle forced refresh from navigation state
  useEffect(() => {
    if (location.state?.refresh) {
      console.log("Forced refresh of projects triggered");
      refreshProjects();
      
      // Clear the location state to prevent infinite refreshes
      history.replaceState(null, "", location.pathname);
    }
  }, [location.state?.refresh, refreshProjects]);

  useEffect(() => {
    // If the projects are empty but not loading, show a warning
    if (!isLoading && projects?.length === 0 && !error) {
      toast.info("Your projects list is empty. Create your first project!");
    }
  }, [projects, isLoading, error]);

  const filteredProjects = projects?.filter(
    project => project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project?.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateProject = () => {
    // Force refresh projects list after creation
    setTimeout(() => {
      refreshProjects();
    }, 500);
  };

  return (
    <MainLayout>
      <ContentContainer>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Your Projects {!isLoading && filteredProjects && `(${filteredProjects.length})`}
              </h1>
              <p className="text-muted-foreground mt-1">Manage your AI spaces</p>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-start sm:items-center">
              <div className="w-full sm:w-auto">
                <Search 
                  onSearch={handleSearch} 
                  value={searchQuery} 
                  id="project-search"
                  name="project-search-query"
                />
              </div>
              <CreateProjectDialog 
                key="project-dialog" 
                onProjectCreated={handleCreateProject}
              />
            </div>
          </div>

          {projects && projects.length > 0 ? (
            <>
              <div className="flex justify-end gap-3">
                <ViewToggle
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                />
              </div>
              <ProjectsList 
                projects={filteredProjects || []}
                isLoading={isLoading}
                viewMode={viewMode}
                sortOption={sortOption}
              />
            </>
          ) : (
            <EmptyProjectsState isLoading={isLoading} error={error} />
          )}
        </div>
      </ContentContainer>
    </MainLayout>
  );
};

export default Projects;
