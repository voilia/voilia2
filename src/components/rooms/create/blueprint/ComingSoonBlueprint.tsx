
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ComingSoonBlueprint() {
  return (
    <div className="space-y-2 opacity-60">
      <Label className="flex items-center gap-2" htmlFor="blueprint">
        Start from Blueprint
        <Badge variant="outline" className="text-xs">Coming Soon</Badge>
      </Label>
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Choose a blueprint" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="disabled">Choose a blueprint</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
