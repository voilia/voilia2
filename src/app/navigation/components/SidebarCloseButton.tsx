
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarCloseButtonProps {
  onClick: () => void;
}

export function SidebarCloseButton({ onClick }: SidebarCloseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95 z-50 md:hidden"
      onClick={onClick}
    >
      <X className="h-5 w-5" />
      <span className="sr-only">Close sidebar</span>
    </Button>
  );
}
