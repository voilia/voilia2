
import { cn } from "@/lib/utils";
import { sidebarNavItems } from "@/config/navigation";
import { SidebarNavItem } from "@/app/navigation/SidebarNavItem";

interface SidebarContentProps {
  isCollapsed: boolean;
  onNavItemClick?: () => void;
}

export function SidebarContent({ isCollapsed, onNavItemClick }: SidebarContentProps) {
  return (
    <>
      <div className={cn(
        "flex h-14 items-center border-b border-sidebar-border px-4 justify-center",
        isCollapsed ? "opacity-0 hidden" : "opacity-100"
      )}>
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/f8cf0e0e-b715-4873-9611-ac7f615574be.png" 
            alt="Voilia Logo" 
            className="w-24 h-8"
          />
        </div>
      </div>
      
      <div className={cn(
        "flex flex-col gap-1 overflow-y-auto p-3 flex-grow",
        isCollapsed ? "opacity-0 hidden" : "opacity-100"
      )}>
        {sidebarNavItems.map((item, index) => (
          <SidebarNavItem
            key={index}
            title={item.title}
            icon={item.icon}
            children={item.children}
            isCollapsed={isCollapsed}
            onItemClick={onNavItemClick}
          />
        ))}
      </div>
    </>
  );
}
