
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function HeaderControls() {
  return (
    <div className="flex items-center space-x-3">
      <ThemeToggle />
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
      >
        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            UV
          </AvatarFallback>
        </Avatar>
        <span className="sr-only">User profile</span>
      </Button>
    </div>
  );
}
