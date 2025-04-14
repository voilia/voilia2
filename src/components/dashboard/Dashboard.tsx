import { Bot, Folders, MessageSquare } from "lucide-react";
import { ItemsSection } from "@/components/dashboard/ItemsSection";
import { pinnedProjects, pinnedRooms, pinnedAgents } from "@/data/dashboard";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";

export function Dashboard() {
  return (
    <div>
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
          onCreateNew={() => null}
          createButtonText="Create Project"
          CreateButton={() => <CreateProjectDialog />}
          className="animate-fade-in"
        />

        <ItemsSection
          title="Pinned Rooms"
          items={pinnedRooms}
          icon={MessageSquare}
          baseUrl="/rooms"
          onCreateNew={() => null}
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
  );
}
