
import { ChevronDown, ChevronRight } from "lucide-react";

interface NavItemChildrenToggleProps {
  isOpen: boolean;
}

export function NavItemChildrenToggle({ isOpen }: NavItemChildrenToggleProps) {
  return (
    <div className="flex items-center">
      {isOpen ? (
        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground/50" />
      ) : (
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50" />
      )}
    </div>
  );
}
