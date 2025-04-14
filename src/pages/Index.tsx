
import { useState } from "react";
import { MainLayout } from "@/app/layout/MainLayout";
import { Dashboard } from "@/app/dashboard/Dashboard";
import { toast } from "@/hooks/use-toast";

const Index = () => {
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
    <MainLayout>
      <Dashboard 
        onCreateProject={handleCreateProject}
        onCreateRoom={handleCreateRoom}
      />
    </MainLayout>
  );
};

export default Index;
