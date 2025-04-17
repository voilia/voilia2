
import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react";
import { useSmartBar } from "../../context/SmartBarContext";
import type { SmartBarMode } from "../../types/smart-bar-types";
import { useRef, useEffect, useState, KeyboardEvent, useCallback } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useThrottle } from "./hooks/useThrottle";

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
  const [selectedIndex, setSelectedIndex] = useState(modes.findIndex(m => m.id === mode));
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
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
      
      setPopoverWidth(rect.width);
      setPopoverPosition({
        top: rect.top - 12, // Position above with small gap
        left: rect.left
      });
    }
  }, [animationState]);

  const throttledUpdatePosition = useThrottle(updatePosition, 100);

  // Animation state management
  useEffect(() => {
    if (popoverOpen) {
      setAnimationState('entering');
      setTimeout(() => setAnimationState('entered'), 50);
    } else if (animationState === 'entered' || animationState === 'entering') {
      setAnimationState('exiting');
      setTimeout(() => setAnimationState('exited'), 200);
    }
  }, [popoverOpen, animationState]);

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
        if (modeRefs.current[selectedIndex]) {
          modeRefs.current[selectedIndex]?.focus();
        }
      }, 50);
    }
  }, [animationState, selectedIndex]);

  const handleSelectMode = (selectedMode: SmartBarMode, index: number) => {
    setMode(selectedMode);
    setSelectedIndex(index);
    closePopover();
  };
  
  const closePopover = () => {
    setPopoverOpen(false);
    setTimeout(() => {
      if (triggerRef.current) {
        const triggerElement = triggerRef.current.querySelector('button');
        if (triggerElement) {
          triggerElement.focus();
        }
      }
    }, 250);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPopoverOpen(!popoverOpen);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!popoverOpen) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % modes.length);
        modeRefs.current[(selectedIndex + 1) % modes.length]?.focus();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + modes.length) % modes.length);
        modeRefs.current[(selectedIndex - 1 + modes.length) % modes.length]?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        closePopover();
        break;
      case 'Tab':
        if (!e.shiftKey && selectedIndex === modes.length - 1) {
          e.preventDefault();
          setSelectedIndex(0);
          modeRefs.current[0]?.focus();
        } else if (e.shiftKey && selectedIndex === 0) {
          e.preventDefault();
          setSelectedIndex(modes.length - 1);
          modeRefs.current[modes.length - 1]?.focus();
        }
        break;
    }
  };

  useEffect(() => {
    if (!popoverOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) &&
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node)
      ) {
        closePopover();
      }
    };

    // Use capture phase to get the events before they're stopped
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [popoverOpen]);

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const getAnimationStyles = () => {
    if (prefersReducedMotion) return {};
    
    switch (animationState) {
      case 'entering':
        return { 
          opacity: 0,
          transform: 'translateY(-100%) scale(0.98)'
        };
      case 'entered':
        return { 
          opacity: 1,
          transform: 'translateY(-100%) scale(1)'
        };
      case 'exiting':
        return { 
          opacity: 0,
          transform: 'translateY(-100%) scale(0.98)'
        };
      default:
        return {};
    }
  };

  const renderPopover = () => {
    if (animationState === 'exited' || typeof document === 'undefined') return null;
    
    return createPortal(
      <div 
        ref={popoverRef}
        className={cn(
          "mode-selector-popover fixed z-50 overflow-hidden",
          "shadow-lg rounded-2xl",
          isDark 
            ? "bg-black/30 border-white/10" 
            : "bg-foreground/5 border-foreground/10",
          "backdrop-blur-lg border"
        )}
        style={{
          width: popoverWidth ? `${popoverWidth}px` : 'auto',
          top: `${popoverPosition.top}px`,
          left: `${popoverPosition.left}px`,
          ...getAnimationStyles(),
          transition: prefersReducedMotion ? 'none' : 'opacity 200ms ease, transform 200ms ease'
        }}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Select Mode"
      >
        <div 
          className="flex w-full divide-x divide-border"
          role="menubar"
          aria-orientation="horizontal"
        >
          {modes.map(({ id, icon: Icon, label }, index) => {
            const isSelected = mode === id;
            return (
              <button
                key={id}
                ref={el => (modeRefs.current[index] = el)}
                onClick={() => handleSelectMode(id, index)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectMode(id, index);
                  }
                }}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-3",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                  "active:outline-none",
                  isSelected && "bg-muted/30"
                )}
                role="menuitem"
                aria-selected={isSelected}
                tabIndex={0}
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
      <div 
        ref={triggerRef} 
        onClick={handleTriggerClick}
        aria-haspopup="dialog"
        aria-expanded={popoverOpen}
      >
        {children}
      </div>
      {renderPopover()}
    </>
  );
}
