
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MobileSidebarFooterProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function MobileSidebarFooter({ isCollapsed, onToggleSidebar }: MobileSidebarFooterProps) {
  return (
    <div className="mt-auto p-4 border-t border-sidebar-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              UV
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">User</span>
            <span className="text-xs text-gray-500">user@example.com</span>
          </div>
        </div>
        
        <ThemeToggle />
      </div>
    </div>
  );
}
