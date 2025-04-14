
import { LucideIcon } from "lucide-react";

interface NavItemIconProps {
  icon?: LucideIcon;
}

export function NavItemIcon({ icon: Icon }: NavItemIconProps) {
  if (!Icon) return null;
  
  return (
    <Icon className="h-5 w-5" />
  );
}
