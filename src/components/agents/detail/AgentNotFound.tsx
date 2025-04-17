
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

export function AgentNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Bot className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        We couldn't find the agent you're looking for. It may have been removed or the URL might be incorrect.
      </p>
      <Button asChild>
        <Link to="/agents">
          Browse Available Agents
        </Link>
      </Button>
    </div>
  );
}
