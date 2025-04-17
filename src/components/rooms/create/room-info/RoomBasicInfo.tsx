
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
    <>
      <div className="space-y-2">
        <Label htmlFor="room-name">Room Name*</Label>
        <Input
          id="room-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter room name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="room-description">Description (optional)</Label>
        <Textarea
          id="room-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the purpose of this room"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="room-color">Room Color</Label>
        <ColorSwatch
          id="room-color"
          value={color}
          onChange={setColor}
        />
      </div>
    </>
  );
}
