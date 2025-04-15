import { useState } from "react";
import { MainLayout } from "@/app/layout/MainLayout";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { useProjects } from "@/hooks/useProjects";
import { EmptyProjectsState } from "@/components/projects/EmptyProjectsState";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ViewToggle, ViewMode, SortOption } from "@/components/projects/ViewToggle";
import { Search } from "@/components/Search";

const Projects = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOption, setSortOption] = useState<SortOption>("updated_at");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { projects, isLoading, error } = useProjects();

  const filteredProjects = projects?.filter(
    project => project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <MainLayout>
      <ContentContainer>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Your Projects {filteredProjects && `(${filteredProjects.length})`}
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
              <CreateProjectDialog key="project-dialog" />
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
