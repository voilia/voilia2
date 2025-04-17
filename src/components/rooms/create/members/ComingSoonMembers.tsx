
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export function ComingSoonMembers() {
  return (
    <div className="space-y-2 opacity-60">
      <Label className="flex items-center gap-2" htmlFor="members">
        Add Members
        <Badge variant="outline" className="text-xs">Coming Soon</Badge>
      </Label>
      <div className="p-3 border rounded-lg bg-muted/50 text-sm text-muted-foreground">
        You'll be able to invite collaborators after Room creation
      </div>
    </div>
  );
}
