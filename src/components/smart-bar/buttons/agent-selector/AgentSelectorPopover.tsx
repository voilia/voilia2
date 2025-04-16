
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

export function AgentSelectorPopover({ children }: { children: React.ReactNode }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const triggerRef = useRef<HTMLDivElement>(null);

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

  // Toggle popover when clicking the trigger
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent document click from firing immediately
    setPopoverOpen(!popoverOpen);
  };

  // Close popover when clicking outside
  useEffect(() => {
    if (!popoverOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the trigger and outside the popover
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) &&
        !document.querySelector('.agent-selector-popover')?.contains(event.target as Node)
      ) {
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
          "agent-selector-popover fixed z-50 overflow-hidden",
          "shadow-lg transition-all duration-200 rounded-2xl",
          isDark 
            ? "bg-black/30 border-white/10" 
            : "bg-foreground/5 border-foreground/10",
          "backdrop-blur-lg border p-4"
        )}
        style={{
          width: popoverWidth ? `${popoverWidth}px` : 'auto',
          top: `${popoverPosition.top}px`,
          left: `${popoverPosition.left}px`,
          transform: 'translateY(-100%)', // Move up by 100% of its height
        }}
      >
        <div className="text-center py-3">
          <h3 className="text-lg font-medium">Agent Selector</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Choose an AI agent to help with your task
          </p>
          <div className="mt-3 text-xs text-muted-foreground">
            Agent selection coming soon
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {children}
      </div>
      {renderPopover()}
    </>
  );
}
