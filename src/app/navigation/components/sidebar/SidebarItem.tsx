
import { LucideIcon } from "lucide-react";
import { NavItemLabel } from "../NavItemLabel";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { ReactNode } from "react";

interface SidebarItemProps {
  title: string;
  icon?: LucideIcon;
  asChild?: boolean;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
  children?: ReactNode; // Add children prop
}

export function SidebarItem({ 
  title, 
  icon, 
  asChild = false,
  isActive,
  className,
  onClick,
  children,
  ...props 
}: SidebarItemProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-sidebar="item"
      data-active={isActive}
      className={cn(
        "flex w-full items-center justify-between p-2 rounded-md",
        "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring transition-colors",
        isActive && "bg-accent/50 font-medium",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children || <NavItemLabel title={title} icon={icon} />}
    </Comp>
  );
}
