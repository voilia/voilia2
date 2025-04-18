
import { ReactNode, useEffect } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSmartBar } from "../../context/SmartBarContext";
import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";
import { useFilePopoverPosition } from "../../file-upload/hooks/useFilePopoverPosition";

interface ModeSelectorPopoverProps {
  children: ReactNode;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ModeSelectorPopover({ 
  children, 
  disabled, 
  open, 
  onOpenChange 
}: ModeSelectorPopoverProps) {
  const { mode, setMode } = useSmartBar();
  const { popoverWidth, popoverPosition } = useFilePopoverPosition(open || false);
  
  const handleModeSelect = (newMode: "chat" | "visual" | "assist" | "vault") => {
    if (disabled) return;
    setMode(newMode);
    if (onOpenChange) onOpenChange(false);
  };
  
  // Force recalculation of position when open state changes
  useEffect(() => {
    if (open) {
      // Apply a small delay to ensure DOM has updated
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [open]);
  
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "p-0 z-[100]",
          "border border-white/20 dark:border-slate-700/30",
          "bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg",
          "shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
          "rounded-xl overflow-hidden"
        )}
        align="center"
        sideOffset={5}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: popoverWidth ? `${popoverWidth}px` : 'auto',
          position: 'fixed',
          top: `${Math.max(0, popoverPosition.top - 10)}px`,
          left: `${popoverPosition.left}px`,
          transform: 'translateY(-100%)',
          marginTop: '-10px',
        }}
      >
        <div className="grid grid-cols-4">
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4",
              "transition-all duration-200",
              "hover:bg-white/50 dark:hover:bg-slate-800/50",
              mode === "chat" ? "bg-white/30 dark:bg-slate-800/30" : "bg-transparent",
              mode === "chat" ? "text-foreground" : "text-muted-foreground"
            )}
            onClick={() => handleModeSelect("chat")}
          >
            <BotMessageSquare className="h-6 w-6" />
            <span className="text-sm font-medium">Chat</span>
          </button>
          
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4",
              "transition-all duration-200",
              "hover:bg-white/50 dark:hover:bg-slate-800/50",
              mode === "visual" ? "bg-white/30 dark:bg-slate-800/30" : "bg-transparent",
              mode === "visual" ? "text-foreground" : "text-muted-foreground",
              "border-l border-border/40"
            )}
            onClick={() => handleModeSelect("visual")}
          >
            <Palette className="h-6 w-6" />
            <span className="text-sm font-medium">Visual</span>
          </button>
          
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4",
              "transition-all duration-200",
              "hover:bg-white/50 dark:hover:bg-slate-800/50",
              mode === "assist" ? "bg-white/30 dark:bg-slate-800/30" : "bg-transparent",
              mode === "assist" ? "text-foreground" : "text-muted-foreground",
              "border-l border-border/40"
            )}
            onClick={() => handleModeSelect("assist")}
          >
            <Wrench className="h-6 w-6" />
            <span className="text-sm font-medium">Assist</span>
          </button>
          
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4",
              "transition-all duration-200",
              "hover:bg-white/50 dark:hover:bg-slate-800/50",
              mode === "vault" ? "bg-white/30 dark:bg-slate-800/30" : "bg-transparent",
              mode === "vault" ? "text-foreground" : "text-muted-foreground",
              "border-l border-border/40"
            )}
            onClick={() => handleModeSelect("vault")}
          >
            <Vault className="h-6 w-6" />
            <span className="text-sm font-medium">Vault</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
