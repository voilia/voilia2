
import { LucideIcon } from "lucide-react";
import { NavItemIcon } from "./NavItemIcon";

interface NavItemLabelProps {
  title: string;
  icon?: LucideIcon;
}

export function NavItemLabel({ title, icon }: NavItemLabelProps) {
  return (
    <div className="flex items-center gap-3">
      <NavItemIcon icon={icon} />
      <span>{title}</span>
    </div>
  );
}
