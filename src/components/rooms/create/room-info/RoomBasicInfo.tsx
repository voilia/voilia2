
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorSwatch } from "@/components/projects/ColorSwatch";
import { ProjectColor } from "@/components/projects/types";

interface RoomBasicInfoProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  color: ProjectColor;
  setColor: (color: ProjectColor) => void;
}

export function RoomBasicInfo({
  name,
  setName,
  description,
  setDescription,
  color,
  setColor,
}: RoomBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <Label htmlFor="room-name" className="font-medium">
          Room Name<span className="text-destructive ml-0.5">*</span>
        </Label>
        <Input
          id="room-name"
          name="room-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter room name"
          className="h-11 px-3.5"
        />
      </div>
      
      <div className="space-y-2.5">
        <Label htmlFor="room-description" className="font-medium">
          Description <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="room-description"
          name="room-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the purpose of this room"
          rows={2}
          className="resize-none px-3.5"
        />
      </div>
      
      <div className="space-y-2.5">
        <Label htmlFor="room-color" className="font-medium">Room Color</Label>
        <ColorSwatch
          id="room-color"
          value={color}
          onChange={setColor}
        />
      </div>
    </div>
  );
}

