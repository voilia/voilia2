
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyRoomsState } from "./rooms/EmptyRoomsState";
import { RoomCard } from "./rooms/RoomCard";
import { useRooms } from "@/hooks/useRooms";
import { CreateRoomModal } from "@/components/rooms/CreateRoomModal";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectRoomsTabProps {
  projectId: string;
}

export function ProjectRoomsTab({ projectId }: ProjectRoomsTabProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: rooms, isLoading, error } = useRooms(projectId);

  if (!isLoading && (!rooms || rooms.length === 0)) {
    return (
      <>
        <EmptyRoomsState onCreateRoom={() => setIsCreateModalOpen(true)} />
        <CreateRoomModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          initialProjectId={projectId}
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
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
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

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        initialProjectId={projectId}
      />
    </div>
  );
}
