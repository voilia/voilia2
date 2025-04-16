
import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";
import { useSmartBar } from "../../context/SmartBarContext";
import type { SmartBarMode } from "../../types/smart-bar-types";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const modes: { id: SmartBarMode; icon: typeof BotMessageSquare; label: string }[] = [
  { id: "chat", icon: BotMessageSquare, label: "Chat" },
  { id: "visual", icon: Palette, label: "Visual" },
  { id: "assist", icon: Wrench, label: "Assist" },
  { id: "vault", icon: Vault, label: "Vault" }
];

export function ModeSelectorPopover({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useSmartBar();
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const updateSmartBarDimensions = () => {
      if (typeof window === 'undefined') return;
      
      const smartBarForm = document.querySelector('form.rounded-2xl');
      if (smartBarForm) {
        const rect = smartBarForm.getBoundingClientRect();
        
        setPopoverWidth(rect.width);
        setPopoverPosition({
          top: rect.top - 12, // Position above with small gap
          left: rect.left
        });
      }
    };
    
    if (popoverOpen) {
      updateSmartBarDimensions();
      window.addEventListener('resize', updateSmartBarDimensions);
      window.addEventListener('scroll', updateSmartBarDimensions);
      
      return () => {
        window.removeEventListener('resize', updateSmartBarDimensions);
        window.removeEventListener('scroll', updateSmartBarDimensions);
      };
    }
  }, [popoverOpen]);

  const handleSelectMode = (selectedMode: SmartBarMode) => {
    setMode(selectedMode);
    setPopoverOpen(false);
  };

  // Close popover when clicking outside
  useEffect(() => {
    if (!popoverOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mode-selector-popover')) {
        setPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popoverOpen]);

  const renderPopover = () => {
    if (!popoverOpen || typeof document === 'undefined') return null;
    
    return createPortal(
      <div 
        className={cn(
          "mode-selector-popover fixed z-50 overflow-hidden",
          "shadow-lg transition-all duration-200 rounded-2xl",
          isDark ? "bg-black/90" : "bg-white/90",
          "backdrop-blur-lg border",
          isDark ? "border-white/10" : "border-foreground/10"
        )}
        style={{
          width: popoverWidth ? `${popoverWidth}px` : 'auto',
          top: `${popoverPosition.top}px`,
          left: `${popoverPosition.left}px`,
          transform: 'translateY(-100%)', // Move up by 100% of its height
        }}
      >
        <div className="flex w-full divide-x divide-border">
          {modes.map(({ id, icon: Icon, label }) => {
            const isSelected = mode === id;
            return (
              <button
                key={id}
                onClick={() => handleSelectMode(id)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-3",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-0 focus:ring-offset-0",
                  "active:outline-none",
                  isSelected && "bg-muted/30"
                )}
                style={{ outline: 'none' }}
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
      </div>,
      document.body
    );
  };

  return (
    <>
      <div onClick={() => setPopoverOpen(!popoverOpen)}>
        {children}
      </div>
      {renderPopover()}
    </>
  );
}
