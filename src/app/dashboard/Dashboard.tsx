
import { Bot, Folders, MessageSquare } from "lucide-react";
import { ItemsSection } from "@/components/ItemsSection";
import { dashboardData } from "./data";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your AI Workspace. Here are your pinned items.</p>
      </div>

      <ItemsSection 
        title="Projects" 
        items={dashboardData.projects} 
        icon={Folders} 
        baseUrl="/projects"
        CreateButton={() => <CreateProjectDialog />}
      />

      <ItemsSection 
        title="Rooms" 
        items={dashboardData.rooms} 
        icon={MessageSquare} 
        baseUrl="/rooms"
        onCreateNew={() => null}
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
