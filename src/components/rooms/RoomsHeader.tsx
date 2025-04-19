import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function RoomsHeader() {
  return (
    <div className="flex flex-col space-y-1.5 px-6 py-4 border-b">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Rooms</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/rooms/demoroom1" className="flex items-center gap-1">
              <span>✨</span>
              <span>Demo Room</span>
            </Link>
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Room
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Create and manage your conversation rooms
      </p>
    </div>
  );
}
