
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface EmptyAgentsStateProps {
  onClear: () => void;
}

export function EmptyAgentsState({ onClear }: EmptyAgentsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border rounded-lg text-center space-y-2">
      <Filter className="h-10 w-10 text-muted-foreground" />
      <div>
        <p className="font-medium">No agents found</p>
        <p className="text-sm text-muted-foreground">Try a different search term</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
      >
        Clear search
      </Button>
    </div>
  );
}
