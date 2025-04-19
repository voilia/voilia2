import { ReactNode } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSmartBar } from "../../context/SmartBarContext";
import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { usePopoverPosition } from "../../voice-input/hooks/usePopoverPosition";
import { createPortal } from "react-dom";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { popoverWidth, popoverPosition } = usePopoverPosition();
  
  const handleModeSelect = (newMode: "chat" | "visual" | "assist" | "vault") => {
    if (disabled) return;
    setMode(newMode);
    if (onOpenChange) onOpenChange(false);
  };

  const PopoverContent = () => {
    if (!open) return null;

    return createPortal(
      <div
        className={cn(
          "fixed z-[100] overflow-hidden",
          "rounded-xl border",
          isDark 
            ? "bg-black/60 border-white/10" 
            : "bg-white/60 border-foreground/10",
          "backdrop-blur-lg shadow-lg"
        )}
        style={{
          width: popoverWidth ? `${popoverWidth}px` : 'auto',
          top: `${Math.max(0, popoverPosition.top - 85)}px`,
          left: `${popoverPosition.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-4">
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4",
              "transition-all duration-200",
              "hover:bg-white/20 dark:hover:bg-slate-800/50",
              mode === "chat" ? "bg-white/30 dark:bg-slate-800/30 text-foreground" : "text-muted-foreground"
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
              "hover:bg-white/20 dark:hover:bg-slate-800/50",
              mode === "visual" ? "bg-white/30 dark:bg-slate-800/30 text-foreground" : "text-muted-foreground",
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
              "hover:bg-white/20 dark:hover:bg-slate-800/50",
              mode === "assist" ? "bg-white/30 dark:bg-slate-800/30 text-foreground" : "text-muted-foreground",
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
              "hover:bg-white/20 dark:hover:bg-slate-800/50",
              mode === "vault" ? "bg-white/30 dark:bg-slate-800/30 text-foreground" : "text-muted-foreground",
              "border-l border-border/40"
            )}
            onClick={() => handleModeSelect("vault")}
          >
            <Vault className="h-6 w-6" />
            <span className="text-sm font-medium">Vault</span>
          </button>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent />
    </Popover>
  );
}
