
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ItemsSection } from "@/components/ItemsSection";
import { Bot, Folders, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data
const pinnedProjects = [
  {
    id: "1",
    title: "AI Assistant",
    description: "Natural language processing AI assistant",
    isPinned: true,
  },
  {
    id: "2",
    title: "Data Visualization",
    description: "Interactive data visualization tool",
    isPinned: true,
  },
];

const pinnedRooms = [
  {
    id: "1",
    title: "Development Team",
    description: "Discuss development tasks and issues",
    isPinned: true,
  },
];

const pinnedAgents = [
  {
    id: "1",
    title: "Code Assistant",
    description: "Helps with code generation and reviews",
    isPinned: true,
  },
  {
    id: "2",
    title: "Research Agent",
    description: "Conducts research and summarizes findings",
    isPinned: true,
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [sidebarWidth] = useState(isMobile ? 0 : 240);
  
  const handleCreateProject = () => {
    toast({
      title: "Create Project",
      description: "Project creation functionality coming soon!",
    });
  };

  const handleCreateRoom = () => {
    toast({
      title: "Create Room",
      description: "Room creation functionality coming soon!",
    });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isMobile ? 'pl-0' : `pl-[${sidebarWidth}px]`}`}>
        <div className="p-6 lg:p-8 ml-0 sm:ml-[70px] lg:ml-[240px] transition-all duration-300">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to your AI Workspace. Here are your pinned items.
            </p>
          </div>

          <div className="space-y-8">
            <ItemsSection
              title="Pinned Projects"
              items={pinnedProjects}
              icon={Folders}
              baseUrl="/projects"
              onCreateNew={handleCreateProject}
              createButtonText="Create Project"
              className="animate-fade-in"
            />

            <ItemsSection
              title="Pinned Rooms"
              items={pinnedRooms}
              icon={MessageSquare}
              baseUrl="/rooms"
              onCreateNew={handleCreateRoom}
              createButtonText="Create Room"
              className="animate-fade-in [animation-delay:100ms]"
            />

            <ItemsSection
              title="Pinned Agents"
              items={pinnedAgents}
              icon={Bot}
              baseUrl="/agents"
              className="animate-fade-in [animation-delay:200ms]"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
