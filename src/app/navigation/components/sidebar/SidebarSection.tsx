
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  children: ReactNode;
  className?: string;
}

export function SidebarSection({ children, className }: SidebarSectionProps) {
  return (
    <section
      data-sidebar="section"
      className={cn("flex flex-col gap-1", className)}
    >
      {children}
    </section>
  );
}
