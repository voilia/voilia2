
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyRoomsStateProps {
  onCreateRoom: () => void;
}

export function EmptyRoomsState({ onCreateRoom }: EmptyRoomsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-full" />
        <MessageSquare className="h-16 w-16 text-muted-foreground/50 relative z-10" />
      </div>
      <h3 className="text-xl font-medium mb-2">No rooms yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Create your first room to start conversations and collaborate
      </p>
      <Button onClick={onCreateRoom} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Room
      </Button>
    </div>
  );
}
