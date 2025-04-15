
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmptyRoomsState } from "./rooms/EmptyRoomsState";
import { RoomCard } from "./rooms/RoomCard";
import { CreateRoomDialog } from "./rooms/CreateRoomDialog";
import { useRooms } from "@/hooks/useRooms";

interface ProjectRoomsTabProps {
  projectId: string;
}

export function ProjectRoomsTab({ projectId }: ProjectRoomsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");

  const { data: rooms, isLoading, refetch } = useRooms(projectId);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error("Room name is required");
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("rooms")
        .insert({
          name: newRoomName,
          description: newRoomDescription || null,
          project_id: projectId,
          created_by: user.user?.id,
        });

      if (error) throw error;

      toast.success("Room created successfully");
      refetch();
      setIsCreateDialogOpen(false);
      setNewRoomName("");
      setNewRoomDescription("");
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
            <div key={i} className="animate-pulse">
              <div className="h-[120px] bg-muted/30 rounded-lg mb-2" />
              <div className="h-[80px] bg-muted/30 rounded-lg" />
            </div>
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
      />
    </div>
  );
}
