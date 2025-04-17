import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";
import { useSmartBar } from "../../context/SmartBarContext";
import type { SmartBarMode } from "../../types/smart-bar-types";
import { useSmartBarColors } from "../../hooks/useSmartBarColors";
import { useCallback, useEffect, useRef, useState } from "react";
import { useThrottle } from "./hooks/useThrottle";
import { cn } from "@/lib/utils";

const MODES: { id: SmartBarMode; label: string; icon: React.ElementType }[] = [
  {
    id: "chat",
    label: "Chat",
    icon: BotMessageSquare
  },
  {
    id: "visual",
    label: "Visual",
    icon: Palette
  },
  {
    id: "assist",
    label: "Assist",
    icon: Wrench
  },
  {
    id: "vault",
    label: "Vault",
    icon: Vault
  }
];

// Initial position object
const initialPosition = {
  top: 0,
  left: 0
};

type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited';

interface ModeSelectorPopoverProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export function ModeSelectorPopover({ children, disabled = false }: ModeSelectorPopoverProps) {
  const { mode, setMode } = useSmartBar();
  const { getColors } = useSmartBarColors();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [animationState, setAnimationState] = useState<AnimationState>('exited');
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const modeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // This is a critical function that calculates the position of the popover
  // relative to the smart bar form
  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined' || animationState === 'exited') return;
    
    const smartBarForm = document.querySelector('form.rounded-2xl');
    if (smartBarForm) {
      const rect = smartBarForm.getBoundingClientRect();
      setPosition({
        // Position above the SmartBar form
        top: rect.top - 200, // 200px height for popover
        left: rect.left
      });
    }
  }, [animationState]);

  const throttledUpdatePosition = useThrottle(updatePosition, 100);

  // Animation state management
  useEffect(() => {
    if (popoverOpen) {
      setAnimationState('entering');
      setTimeout(() => setAnimationState('entered'), 200);
    } else {
      setAnimationState('exiting');
      setTimeout(() => setAnimationState('exited'), 200);
    }
  }, [popoverOpen]);

  // Position calculation and update
  useEffect(() => {
    // Only run when popover is visible
    if (animationState === 'exited') return;
    
    // Initial position calculation
    updatePosition();
    
    // Set up event listeners for repositioning
    window.addEventListener('resize', throttledUpdatePosition);
    window.addEventListener('scroll', throttledUpdatePosition);
    
    // Force recalculation on animation frame for more reliable positioning
    requestAnimationFrame(updatePosition);
    
    return () => {
      window.removeEventListener('resize', throttledUpdatePosition);
      window.removeEventListener('scroll', throttledUpdatePosition);
    };
  }, [animationState, throttledUpdatePosition, updatePosition]);

  // Focus management
  useEffect(() => {
    if (animationState === 'entered') {
      setTimeout(() => {
        const currentModeIndex = MODES.findIndex(m => m.id === mode);
        if (currentModeIndex >= 0 && modeRefs.current[currentModeIndex]) {
          modeRefs.current[currentModeIndex]?.focus();
        }
      }, 10);
    }
  }, [animationState, mode]);

  const handleSelectMode = (newMode: SmartBarMode) => {
    setMode(newMode);
    setPopoverOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, mode: SmartBarMode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectMode(mode);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setPopoverOpen(false);
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    setPopoverOpen(!popoverOpen);
  };

  // Close the popover when clicking outside
  useEffect(() => {
    if (!popoverOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking on the trigger
      if (triggerRef.current && triggerRef.current.contains(e.target as Node)) {
        return;
      }
      
      // Don't close if clicking inside the popover
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
        return;
      }
      
      // Otherwise, close the popover
      setPopoverOpen(false);
    };

    // Use capture phase to get the events before they're stopped
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [popoverOpen]);

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <>
      {/* Trigger element */}
      <div 
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={cn(
          "cursor-pointer",
          disabled && "cursor-not-allowed opacity-50"
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Mode selector"
        aria-expanded={popoverOpen}
        aria-haspopup="true"
      >
        {children}
      </div>

      {/* Popover panel */}
      {animationState !== 'exited' && (
        <div
          ref={popoverRef}
          className={cn(
            "fixed left-0 w-full max-w-full md:max-w-md z-50 transition-all duration-200",
            animationState === 'entering' && "opacity-0 translate-y-4",
            animationState === 'entered' && "opacity-100 translate-y-0",
            animationState === 'exiting' && "opacity-0 translate-y-4",
            prefersReducedMotion && "translate-y-0 transition-opacity"
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Select a mode"
        >
          <div className="w-full p-2 bg-popover rounded-lg shadow-lg border border-border backdrop-blur-md">
            <div className="space-y-1">
              <h3 className="font-medium text-sm pl-2 pb-1">Select Mode</h3>
              <div className="grid grid-cols-4 md:grid-cols-4 gap-1">
                {MODES.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = mode === item.id;
                  const colorValue = getColors(item.id);
                  
                  return (
                    <button
                      key={item.id}
                      ref={el => modeRefs.current[index] = el}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-md gap-1 transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive 
                          ? "bg-accent/30 text-accent-foreground" 
                          : "hover:bg-accent/10 text-foreground/90"
                      )}
                      style={{ color: isActive ? colorValue : undefined }}
                      onClick={() => handleSelectMode(item.id)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      aria-selected={isActive}
                      role="option"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
