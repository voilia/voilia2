
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAgentsStateProps {
  isLoading: boolean;
  error: Error | null;
}

export function EmptyAgentsState({ isLoading, error }: EmptyAgentsStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="rounded-full bg-muted h-12 w-12 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
          <div className="h-3 bg-muted rounded w-64 mx-auto"></div>
          <div className="h-3 bg-muted rounded w-52 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <Bot className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-xl font-medium mb-2">Failed to load agents</h3>
        <p className="text-muted-foreground max-w-sm mb-4">
          {error.message || "An error occurred while loading the agents. Please try again."}
        </p>
        <Button>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <Bot className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">No agents available</h3>
      <p className="text-muted-foreground max-w-sm">
        We couldn't find any agents. Check back later as we're regularly adding new capabilities.
      </p>
    </div>
  );
}
