
import { ReactNode } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSmartBar } from "../../context/SmartBarContext";
import { SmartBarModeButton } from "../SmartBarModeButton";
import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";

interface ModeSelectorPopoverProps {
  children: ReactNode;
  disabled?: boolean;
}

export function ModeSelectorPopover({ children, disabled }: ModeSelectorPopoverProps) {
  const { setMode } = useSmartBar();
  
  const handleModeSelect = (mode: "chat" | "visual" | "assist" | "vault") => {
    if (disabled) return;
    setMode(mode);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-56 p-1 z-[100]",
          "border border-white/20 dark:border-slate-700/30",
          "bg-white/90 dark:bg-background/90 backdrop-blur-lg",
          "shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
          "rounded-xl"
        )}
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-1 bg-transparent">
          <SmartBarModeButton 
            icon={BotMessageSquare}
            label="Chat"
            color="#8B5CF6"
            onClick={() => handleModeSelect("chat")}
          />
          <SmartBarModeButton 
            icon={Palette}
            label="Visual"
            color="#F97316"
            onClick={() => handleModeSelect("visual")}
          />
          <SmartBarModeButton 
            icon={Wrench}
            label="Assist"
            color="#3B82F6"
            onClick={() => handleModeSelect("assist")}
          />
          <SmartBarModeButton 
            icon={Vault}
            label="Vault"
            color="#10B981"
            onClick={() => handleModeSelect("vault")}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
