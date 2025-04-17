
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { RoomViewType } from "@/pages/Rooms";
import { FlaskConical, Home } from "lucide-react";

interface ViewToggleProps {
  activeView: RoomViewType;
  onViewChange: (view: RoomViewType) => void;
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <Tabs value={activeView} onValueChange={(value) => onViewChange(value as RoomViewType)} className="w-full sm:w-auto">
      <TabsList className="h-10 w-full sm:w-[400px] grid grid-cols-2">
        <TabsTrigger
          value="my-rooms"
          className={cn(
            "flex items-center gap-2 transition-all data-[state=active]:bg-background",
            activeView === "my-rooms" 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <Home className="h-4 w-4" />
          <span>My Rooms</span>
        </TabsTrigger>
        <TabsTrigger
          value="smart-starts"
          className={cn(
            "flex items-center gap-2 transition-all data-[state=active]:bg-background",
            activeView === "smart-starts" 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <FlaskConical className="h-4 w-4" />
          <span>Smart Starts</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
