import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSmartBar } from "../../context/SmartBarContext";
import type { SmartBarMode } from "../../types/smart-bar-types";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

const modes: { id: SmartBarMode; icon: typeof BotMessageSquare; label: string }[] = [
  { id: "chat", icon: BotMessageSquare, label: "Chat" },
  { id: "visual", icon: Palette, label: "Visual" },
  { id: "assist", icon: Wrench, label: "Assist" },
  { id: "vault", icon: Vault, label: "Vault" }
];

export function ModeSelectorPopover({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useSmartBar();
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Find the SmartBar element to match its width and position
  useEffect(() => {
    const updateSmartBarDimensions = () => {
      if (typeof window === 'undefined') return;
      
      // Find the SmartBar form element (with the rounded-2xl class)
      const smartBarForm = document.querySelector('form.rounded-2xl');
      if (smartBarForm) {
        const rect = smartBarForm.getBoundingClientRect();
        setPopoverWidth(rect.width);
      }
    };
    
    // Run once and then on resize
    updateSmartBarDimensions();
    window.addEventListener('resize', updateSmartBarDimensions);
    
    // Also update when popover opens
    if (popoverOpen) {
      updateSmartBarDimensions();
    }
    
    return () => window.removeEventListener('resize', updateSmartBarDimensions);
  }, [popoverOpen]);

  const handleSelectMode = (selectedMode: SmartBarMode) => {
    setMode(selectedMode);
    setPopoverOpen(false); // Close popover after selection
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "p-0 overflow-hidden shadow-sm",
          "border transition-colors duration-200 rounded-2xl",
          isDark ? "border-white/10 bg-black/30" : "border-foreground/10 bg-foreground/5",
          "backdrop-blur-lg"
        )}
        style={{ width: popoverWidth ? `${popoverWidth}px` : 'auto' }}
        align="center"
        side="top"
        sideOffset={8}
        avoidCollisions={false}
      >
        <div className="flex w-full">
          {modes.map(({ id, icon: Icon, label }) => {
            const isSelected = mode === id;
            return (
              <button
                key={id}
                onClick={() => handleSelectMode(id)}
                className={cn(
                  "flex flex-col items-center justify-center py-3 flex-1",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-0 focus:ring-offset-0", // Remove focus outline
                  "active:outline-none", // Remove active outline
                  isSelected ? "bg-muted/30" : "hover:bg-muted/10"
                )}
                style={{ outline: 'none' }} // Ensure no outline in any browser
              >
                <Icon className={cn(
                  "w-5 h-5 mb-1",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
