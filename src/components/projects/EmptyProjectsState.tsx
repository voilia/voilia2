
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { FolderPlus } from "lucide-react";

interface EmptyProjectsStateProps {
  isLoading: boolean;
  error: Error | null;
}

export function EmptyProjectsState({ isLoading, error }: EmptyProjectsStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-pulse h-16 w-16 bg-muted rounded-full mb-6" />
        <div className="animate-pulse h-8 w-64 bg-muted rounded mb-3" />
        <div className="animate-pulse h-6 w-48 bg-muted rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-destructive mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't load your projects. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="bg-muted/20 p-6 rounded-full mb-6">
        <FolderPlus className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-4">Let's get started!</h3>
      <CreateProjectDialog
        variant="default"
        className="font-medium"
      />
    </div>
  );
}
