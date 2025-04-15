
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface ItemCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  path: string;
  isPinned?: boolean;
  className?: string;
}

export function ItemCard({
  title,
  description,
  icon: Icon,
  path,
  isPinned = false,
  className,
}: ItemCardProps) {
  return (
    <div 
      className={cn(
        "glass-card relative overflow-hidden rounded-xl p-6 transition-all duration-300 group hover-effect",
        className
      )}
    >
      <NavLink to={path} className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <h3 className="font-medium text-lg">{title}</h3>
          </div>
          {isPinned && (
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </NavLink>
    </div>
  );
}
