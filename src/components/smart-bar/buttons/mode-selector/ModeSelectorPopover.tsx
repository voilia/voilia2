
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
  disabled?: boolean; // Add disabled prop to interface
}

export function ModeSelectorPopover({ children, disabled }: ModeSelectorPopoverProps) {
  const { setMode } = useSmartBar();
  
  const handleModeSelect = (mode: "chat" | "visual" | "assist" | "vault") => {
    if (disabled) return; // Respect disabled state
    setMode(mode);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-56 p-0 z-[100]", // Added higher z-index
          "border border-border",
          "bg-background/95 backdrop-blur-sm"
        )}
        align="start"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
      >
        <div className="grid grid-cols-2 gap-px bg-muted p-1">
          <SmartBarModeButton 
            icon={BotMessageSquare}
            label="Chat"
            color="purple"
            onClick={() => handleModeSelect("chat")}
          />
          <SmartBarModeButton 
            icon={Palette}
            label="Visual"
            color="orange"
            onClick={() => handleModeSelect("visual")}
          />
          <SmartBarModeButton 
            icon={Wrench}
            label="Assist"
            color="blue"
            onClick={() => handleModeSelect("assist")}
          />
          <SmartBarModeButton 
            icon={Vault}
            label="Vault"
            color="green"
            onClick={() => handleModeSelect("vault")}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
