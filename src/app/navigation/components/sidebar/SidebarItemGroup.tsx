
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarItemGroupProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function SidebarItemGroup({ children, title, className }: SidebarItemGroupProps) {
  return (
    <div 
      data-sidebar="item-group" 
      className={cn("flex flex-col gap-1", className)}
    >
      {title && (
        <h3 className="px-2 text-sm font-medium text-muted-foreground">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  );
}
