
import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSmartBar } from "../../context/SmartBarContext";
import type { SmartBarMode } from "../../types/smart-bar-types";
import { useRef } from "react";

const modes: { id: SmartBarMode; icon: typeof BotMessageSquare; label: string }[] = [
  { id: "chat", icon: BotMessageSquare, label: "Chat" },
  { id: "visual", icon: Palette, label: "Visual" },
  { id: "assist", icon: Wrench, label: "Assist" },
  { id: "vault", icon: Vault, label: "Vault" }
];

export function ModeSelectorPopover({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useSmartBar();
  const smartBarRef = useRef<HTMLDivElement | null>(null);
  
  // Find the SmartBar element to match its width
  const getSmartBarWidth = () => {
    if (typeof window === 'undefined') return 'auto';
    
    if (!smartBarRef.current) {
      // Try to find the SmartBar container
      const smartBarForm = document.querySelector('form.rounded-2xl');
      if (smartBarForm) {
        smartBarRef.current = smartBarForm as HTMLDivElement;
      }
    }
    
    return smartBarRef.current ? `${smartBarRef.current.offsetWidth}px` : 'auto';
  };

  const getModeColor = (modeId: SmartBarMode, opacity: number = 0.3) => {
    switch (modeId) {
      case "chat": return `bg-purple-500/30`;
      case "visual": return `bg-orange-500/30`;
      case "assist": return `bg-blue-500/30`;
      case "vault": return `bg-green-500/30`;
    }
  };

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="p-2 flex gap-2 bg-background border border-border shadow-lg rounded-lg"
        style={{ width: getSmartBarWidth() }}
        align="start"
        side="top"
        sideOffset={16}
      >
        {modes.map(({ id, icon: Icon, label }) => {
          const isSelected = mode === id;
          return (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-2 rounded-lg flex-1",
                "transition-all duration-200 hover:bg-accent/80",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                isSelected ? getModeColor(id) : "hover:bg-accent/80"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
