
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";

interface MobileSidebarFooterProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function MobileSidebarFooter({ isCollapsed, onToggleSidebar }: MobileSidebarFooterProps) {
  return (
    <div className={cn(
      "mt-auto p-4 border-t border-sidebar-border flex justify-between items-center",
      isCollapsed ? "opacity-0 hidden" : "opacity-100"
    )}>
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
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="rounded-full hover:bg-sidebar-accent/50 transition-all duration-200 active:scale-95"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}
