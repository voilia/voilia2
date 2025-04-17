
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoomViewType } from "@/pages/Rooms";
import { CreateRoomModal } from './CreateRoomModal';

interface RoomsHeaderProps {
  onCreateRoom: () => void;
  activeView: RoomViewType;
  onViewChange: (view: RoomViewType) => void;
}

export function RoomsHeader({ activeView, onViewChange }: RoomsHeaderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Rooms</h1>
        <p className="text-muted-foreground">Create and manage your AI collaboration spaces</p>
      </div>
      
      <div className="flex items-center gap-4 self-end sm:self-auto">
        <div className="flex items-center gap-2 rounded-md border p-1">
          <Button
            variant={activeView === "my-rooms" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("my-rooms")}
            className="text-xs h-8"
          >
            My Rooms
          </Button>
          <Button
            variant={activeView === "smart-starts" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("smart-starts")}
            className="text-xs h-8"
          >
            Smart Starts
          </Button>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          New Room
        </Button>
      </div>
      
      <CreateRoomModal 
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
