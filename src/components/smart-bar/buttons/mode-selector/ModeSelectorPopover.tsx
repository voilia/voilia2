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
  const smartBarRef = useRef<HTMLDivElement | null>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Find the SmartBar element to match its width
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window === 'undefined') return;
      
      // Try to find the SmartBar container
      const smartBarForm = document.querySelector('form.rounded-2xl');
      if (smartBarForm) {
        smartBarRef.current = smartBarForm as HTMLDivElement;
        setPopoverWidth(smartBarForm.clientWidth);
      }
    };
    
    updateWidth();
    
    // Update width on resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleSelectMode = (selectedMode: SmartBarMode) => {
    setMode(selectedMode);
    setOpen(false); // Close popover after selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "p-0 shadow-md rounded-2xl overflow-hidden border",
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
                  isSelected ? "bg-muted/30" : "hover:bg-muted/10"
                )}
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
