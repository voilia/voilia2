
import { MainLayout } from "@/app/layout/MainLayout";
import { useRooms } from "@/hooks/useRooms";
import { RoomsHeader } from "@/components/rooms/RoomsHeader";
import { RoomsContent } from "@/components/rooms/RoomsContent";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { CreateRoomDialog } from "@/components/projects/detail/rooms/CreateRoomDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";

export type RoomViewType = "my-rooms" | "smart-starts";

export default function Rooms() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<RoomViewType>("my-rooms");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Fetch the user's projects to select one when creating a room
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  
  // Fetch all the user's rooms across projects
  const { data: allRooms, isLoading, refetch } = useRooms(selectedProjectId || "all");
  
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("rooms")
        .insert({
          name: roomName.trim(),
          description: roomDescription.trim() || null,
          project_id: selectedProjectId,
          created_by: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Room created successfully!");
      setIsCreateDialogOpen(false);
      setRoomName("");
      setRoomDescription("");
      
      // Refresh the rooms list
      refetch();
      
      // Navigate to the new room
      if (data?.id) {
        navigate(`/rooms/${data.id}`);
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
    }
  };
  
  const handleOpenCreateDialog = () => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      // Set the first project as default if none selected
      setSelectedProjectId(projects[0].id);
    } else if (projects && projects.length === 0) {
      toast.error("You need to create a project first");
      navigate("/projects");
      return;
    }
    
    setIsCreateDialogOpen(true);
  };

  return (
    <MainLayout>
      <RoomsHeader 
        onCreateRoom={handleOpenCreateDialog}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <RoomsContent 
        rooms={allRooms || []}
        isLoading={isLoading}
        activeView={activeView}
      />
      
      <CreateRoomDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        roomName={roomName}
        setRoomName={setRoomName}
        roomDescription={roomDescription}
        setRoomDescription={setRoomDescription}
        onCreateRoom={handleCreateRoom}
        projects={projects || []}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
      />
    </MainLayout>
  );
}
