
import { ItemsSection } from "@/components/ItemsSection";
import { Folder, MessageSquare, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  // Sample data for projects, rooms, and agents
  const projects = [
    { 
      id: "ai-assistant", 
      title: "AI Assistant", 
      description: "Natural language processing AI assistant", 
      isPinned: true 
    },
    { 
      id: "data-visualization", 
      title: "Data Visualization", 
      description: "Interactive data visualization tool", 
      isPinned: true 
    }
  ];

  const rooms = [
    { 
      id: "development-team", 
      title: "Development Team", 
      description: "Discuss development tasks and issues", 
      isPinned: true 
    }
  ];

  const agents = [
    { 
      id: "code-assistant", 
      title: "Code Assistant", 
      description: "Helps with code generation and reviews", 
      isPinned: true 
    },
    { 
      id: "research-agent", 
      title: "Research Agent", 
      description: "Conducts research and summarizes findings", 
      isPinned: true 
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your AI Workspace. Here are your pinned items.</p>
      </div>

      <ItemsSection 
        title="Pinned Projects" 
        items={projects} 
        icon={Folder} 
        baseUrl="/projects"
        onCreateNew={() => {/* Add create project logic */}}
        createButtonText="Create Project"
      />

      <ItemsSection 
        title="Pinned Rooms" 
        items={rooms} 
        icon={MessageSquare} 
        baseUrl="/rooms"
        onCreateNew={() => {/* Add create room logic */}}
        createButtonText="Create Room"
      />

      <ItemsSection 
        title="Pinned Agents" 
        items={agents} 
        icon={Bot} 
        baseUrl="/agents"
      />
    </div>
  );
}
