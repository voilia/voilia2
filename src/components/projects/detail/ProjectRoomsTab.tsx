
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Plus, Users, Clock, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Room {
  id: string;
  name: string;
  description: string | null;
  project_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectRoomsTabProps {
  projectId: string;
}

export function ProjectRoomsTab({ projectId }: ProjectRoomsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");

  // Fetch rooms data
  const { data: rooms, isLoading, refetch } = useQuery({
    queryKey: ["rooms", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("project_id", projectId)
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Room[];
    },
  });

  // Handle room creation
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

  // Empty state
  if (!isLoading && (!rooms || rooms.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium mb-2">No rooms yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create your first room to start conversations and collaborate
        </p>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Room
        </Button>

        {/* Create Room Dialog */}
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

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-[120px] bg-muted/30" />
              <CardContent className="h-[80px]" />
              <CardFooter className="h-[40px]" />
            </Card>
          ))
        ) : (
          // Rooms cards
          rooms?.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        )}
      </div>

      {/* Create Room Dialog */}
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

interface RoomCardProps {
  room: Room;
}

function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-primary/10 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">{room.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Room</DropdownMenuItem>
              <DropdownMenuItem>Edit Room</DropdownMenuItem>
              <DropdownMenuItem>Archive Room</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {room.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>3 members</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Updated {formatDistanceToNow(new Date(room.updated_at), { addSuffix: true })}</span>
        </div>
        <div className="flex -space-x-2">
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
        </div>
      </CardFooter>
    </Card>
  );
}

interface CreateRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  roomName: string;
  setRoomName: (name: string) => void;
  roomDescription: string;
  setRoomDescription: (description: string) => void;
  onCreateRoom: () => void;
}

function CreateRoomDialog({
  isOpen,
  onOpenChange,
  roomName,
  setRoomName,
  roomDescription,
  setRoomDescription,
  onCreateRoom
}: CreateRoomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <span></span> {/* Empty trigger as we control opening externally */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Add a new room to this project for collaboration
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="room-name" className="text-sm font-medium">
              Room Name*
            </label>
            <Input
              id="room-name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="room-description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea
              id="room-description"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              placeholder="Describe the purpose of this room"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreateRoom}>Create Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
