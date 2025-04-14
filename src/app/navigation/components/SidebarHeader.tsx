
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <div className={cn(
      "flex h-14 items-center border-b border-sidebar-border px-4",
      isCollapsed ? "justify-center" : "justify-between"
    )}>
      {!isCollapsed && (
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/f8cf0e0e-b715-4873-9611-ac7f615574be.png" 
            alt="Voilia Logo" 
            className="w-24 h-8"
          />
        </div>
      )}
    </div>
  );
}
