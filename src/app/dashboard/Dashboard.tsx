
import { Dashboard as DashboardComponent } from "@/components/dashboard/Dashboard";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
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
    <DashboardComponent 
      onCreateProject={handleCreateProject} 
      onCreateRoom={handleCreateRoom} 
    />
  );
}
