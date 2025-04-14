
import { ItemsSection } from "@/components/ItemsSection";
import { Folder, MessageSquare, Bot } from "lucide-react";
import { dashboardData } from "./data";
import { toast } from "@/hooks/use-toast";

export function Dashboard() {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your AI Workspace. Here are your pinned items.</p>
      </div>

      <ItemsSection 
        title="Projects" 
        items={dashboardData.projects} 
        icon={Folder} 
        baseUrl="/projects"
        onCreateNew={handleCreateProject}
        createButtonText="Create Project"
      />

      <ItemsSection 
        title="Rooms" 
        items={dashboardData.rooms} 
        icon={MessageSquare} 
        baseUrl="/rooms"
        onCreateNew={handleCreateRoom}
        createButtonText="Create Room"
      />

      <ItemsSection 
        title="Agents" 
        items={dashboardData.agents} 
        icon={Bot} 
        baseUrl="/agents"
      />
    </div>
  );
}
