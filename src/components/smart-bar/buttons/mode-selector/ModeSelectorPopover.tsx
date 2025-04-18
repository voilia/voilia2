
import { ReactNode } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSmartBar } from "../../context/SmartBarContext";
import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";

interface ModeSelectorPopoverProps {
  children: ReactNode;
  disabled?: boolean;
}

export function ModeSelectorPopover({ children, disabled }: ModeSelectorPopoverProps) {
  const { mode, setMode } = useSmartBar();
  
  const handleModeSelect = (newMode: "chat" | "visual" | "assist" | "vault") => {
    if (disabled) return;
    setMode(newMode);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "p-0 z-[100] w-full max-w-[800px]",
          "border border-white/20 dark:border-slate-700/30",
          "bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg",
          "shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
          "rounded-xl"
        )}
        align="center"
        sideOffset={5}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-4 divide-x divide-border/40">
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-l-xl",
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
              mode === "visual" ? "text-foreground" : "text-muted-foreground"
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
              mode === "assist" ? "text-foreground" : "text-muted-foreground"
            )}
            onClick={() => handleModeSelect("assist")}
          >
            <Wrench className="h-6 w-6" />
            <span className="text-sm font-medium">Assist</span>
          </button>
          
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-r-xl",
              "transition-all duration-200",
              "hover:bg-white/50 dark:hover:bg-slate-800/50",
              mode === "vault" ? "bg-white/30 dark:bg-slate-800/30" : "bg-transparent",
              mode === "vault" ? "text-foreground" : "text-muted-foreground"
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
