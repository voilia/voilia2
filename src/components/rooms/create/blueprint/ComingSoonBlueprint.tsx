
import { Clock } from "lucide-react";

export function ComingSoonBlueprint() {
  return (
    <div className="p-4 rounded-lg border bg-muted/5 space-y-2 mt-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Start from Blueprint</h3>
        <span className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full">Coming Soon</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Soon you'll be able to jumpstart your room with pre-configured templates and workflows.
      </p>
    </div>
  );
}
