
import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSmartBar } from "../../context/SmartBarContext";
import type { SmartBarMode } from "../../types/smart-bar-types";

const modes: { id: SmartBarMode; icon: typeof BotMessageSquare; label: string }[] = [
  { id: "chat", icon: BotMessageSquare, label: "Chat" },
  { id: "visual", icon: Palette, label: "Visual" },
  { id: "assist", icon: Wrench, label: "Assist" },
  { id: "vault", icon: Vault, label: "Vault" }
];

export function ModeSelectorPopover({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useSmartBar();

  const getModeColor = (modeId: SmartBarMode) => {
    switch (modeId) {
      case "chat": return "bg-purple-500/30";
      case "visual": return "bg-orange-500/30";
      case "assist": return "bg-blue-500/30";
      case "vault": return "bg-green-500/30";
    }
  };

  const handleModeChange = (newMode: SmartBarMode) => {
    setMode(newMode);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-2 grid grid-cols-2 gap-2 z-[110]" 
        align="center"
        side="top"
        sideOffset={16}
      >
        {modes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleModeChange(id)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg",
              "transition-all duration-300 hover:bg-accent",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              mode === id ? getModeColor(id) : "hover:bg-accent/80"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
