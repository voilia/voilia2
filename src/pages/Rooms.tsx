
import { MainLayout } from "@/app/layout/MainLayout";
import { useRooms } from "@/hooks/useRooms";
import { RoomsHeader } from "@/components/rooms/RoomsHeader";
import { RoomsContent } from "@/components/rooms/RoomsContent";
import { useState } from "react";
import { CreateRoomModal } from "@/components/rooms/CreateRoomModal";

export type RoomViewType = "my-rooms" | "smart-starts";

export default function Rooms() {
  const [activeView, setActiveView] = useState<RoomViewType>("my-rooms");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Fetch all the user's rooms across projects
  const { data: allRooms, isLoading, refetch } = useRooms("all");
  
  return (
    <MainLayout>
      <RoomsHeader 
        onCreateRoom={() => setIsCreateDialogOpen(true)}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <RoomsContent 
        rooms={allRooms || []}
        isLoading={isLoading}
        activeView={activeView}
      />

      <CreateRoomModal
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </MainLayout>
  );
}
