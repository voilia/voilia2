
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmptyRoomsState } from "./rooms/EmptyRoomsState";
import { RoomCard } from "./rooms/RoomCard";
import { CreateRoomDialog } from "./rooms/CreateRoomDialog";
import { useRooms } from "@/hooks/useRooms";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectRoomsTabProps {
  projectId: string;
}

export function ProjectRoomsTab({ projectId }: ProjectRoomsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const navigate = useNavigate();

  const { data: rooms, isLoading, error, refetch } = useRooms(projectId);

  // When the projectId prop changes, update the selectedProjectId state
  useEffect(() => {
    setSelectedProjectId(projectId);
  }, [projectId]);

  // Add error handling for room loading
  useEffect(() => {
    if (error) {
      toast.error("Error loading rooms");
      console.error("Error loading rooms:", error);
    }
  }, [error]);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error("Room name is required");
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("rooms")
        .insert({
          name: newRoomName,
          description: newRoomDescription || null,
          project_id: selectedProjectId,
          created_by: user.user?.id,
        })
        .select('id')
        .single();

      if (error) throw error;

      // Reset form state
      setIsCreateDialogOpen(false);
      setNewRoomName("");
      setNewRoomDescription("");
      
      // Navigate to the newly created room
      if (data && data.id) {
        navigate(`/rooms/${data.id}`);
      } else {
        // Only show toast if not navigating (fallback)
        toast.success("Room created successfully");
        refetch();
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
    }
  };

  if (!isLoading && (!rooms || rooms.length === 0)) {
    return (
      <>
        <EmptyRoomsState onCreateRoom={() => setIsCreateDialogOpen(true)} />
        <CreateRoomDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          roomName={newRoomName}
          setRoomName={setNewRoomName}
          roomDescription={newRoomDescription}
          setRoomDescription={setNewRoomDescription}
          onCreateRoom={handleCreateRoom}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          projects={[]}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">
          Project Rooms {rooms?.length ? `(${rooms.length})` : ""}
        </h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))
        ) : (
          rooms?.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        )}
      </div>

      <CreateRoomDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        roomName={newRoomName}
        setRoomName={setNewRoomName}
        roomDescription={newRoomDescription}
        setRoomDescription={setNewRoomDescription}
        onCreateRoom={handleCreateRoom}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        projects={[]}
      />
    </div>
  );
}
