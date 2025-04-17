
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from "@/components/projects/types";

interface CreateRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  roomName: string;
  setRoomName: (name: string) => void;
  roomDescription: string;
  setRoomDescription: (description: string) => void;
  onCreateRoom: () => void;
  projects?: Project[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
}

export function CreateRoomDialog({
  isOpen,
  onOpenChange,
  roomName,
  setRoomName,
  roomDescription,
  setRoomDescription,
  onCreateRoom,
  projects = [],
  selectedProjectId,
  setSelectedProjectId,
}: CreateRoomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Add a new room to collaborate with AI agents
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="project" className="text-sm font-medium">
              Project*
            </label>
            <Select
              value={selectedProjectId || undefined}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
