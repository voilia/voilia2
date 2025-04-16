
import { BotMessageSquare, ImageIcon, Wrench, Vault } from "lucide-react";
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
  { id: "visual", icon: ImageIcon, label: "Visual" },
  { id: "assist", icon: Wrench, label: "Assist" },
  { id: "vault", icon: Vault, label: "Vault" }
];

export function ModeSelectorPopover({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useSmartBar();

  const getModeColor = (modeId: SmartBarMode) => {
    switch (modeId) {
      case "chat": return "bg-purple-500";
      case "visual": return "bg-orange-500";
      case "assist": return "bg-blue-500";
      case "vault": return "bg-green-500";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-2 grid grid-cols-2 sm:grid-cols-4 gap-2" 
        align="start"
        sideOffset={5}
      >
        {modes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg",
              "transition duration-300 hover:bg-accent",
              mode === id && `${getModeColor(id)}/30`
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
