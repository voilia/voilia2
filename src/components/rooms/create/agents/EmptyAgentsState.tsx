
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

interface EmptyAgentsStateProps {
  onClear: () => void;
}

export function EmptyAgentsState({ onClear }: EmptyAgentsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg text-center space-y-3 mt-4 bg-muted/10">
      <SearchX className="h-12 w-12 text-muted-foreground opacity-50" />
      <div>
        <p className="font-medium text-lg">No agents found</p>
        <p className="text-sm text-muted-foreground">Try a different search term or clear the search</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        className="mt-2"
      >
        Clear search
      </Button>
    </div>
  );
}
