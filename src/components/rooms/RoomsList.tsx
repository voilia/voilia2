
import { Room } from "@/hooks/useRooms";
import { RoomCard } from "@/components/projects/detail/rooms/RoomCard";
import { EmptyRoomsState } from "@/components/projects/detail/rooms/EmptyRoomsState";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface RoomsListProps {
  rooms: Room[];
  isLoading: boolean;
}

export function RoomsList({ rooms, isLoading }: RoomsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRooms(rooms);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = rooms.filter(
      room => room.name.toLowerCase().includes(query) || 
             (room.description && room.description.toLowerCase().includes(query))
    );
    
    setFilteredRooms(filtered);
  }, [searchQuery, rooms]);
  
  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search rooms..."
            className="pl-9"
            disabled
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[220px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  
  // Empty state
  if (rooms.length === 0) {
    return <EmptyRoomsState onCreateRoom={() => {}} />;
  }
  
  return (
    <div>
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search rooms..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-2">No rooms match your search</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
