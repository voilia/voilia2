
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoomViewType } from "@/pages/Rooms";
import { PageHeader } from "@/components/ui/PageHeader";
import { ViewToggle } from "@/components/rooms/ViewToggle";

interface RoomsHeaderProps {
  onCreateRoom: () => void;
  activeView: RoomViewType;
  onViewChange: (view: RoomViewType) => void;
}

export function RoomsHeader({ onCreateRoom, activeView, onViewChange }: RoomsHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <PageHeader 
        title="Your Rooms"
        description="Create and manage your collaboration spaces"
        action={
          <Button onClick={onCreateRoom} className="whitespace-nowrap">
            <Plus className="mr-1.5 h-4 w-4" />
            New Room
          </Button>
        }
      />
      
      <ViewToggle activeView={activeView} onViewChange={onViewChange} />
    </div>
  );
}
