
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PopoverPosition {
  top: number;
  left: number;
}

export function usePopoverPosition() {
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({ top: 0, left: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const updatePosition = () => {
      const smartBarContainer = document.querySelector('.SmartBar');
      
      if (smartBarContainer) {
        const rect = smartBarContainer.getBoundingClientRect();
        setPopoverWidth(rect.width);
        setPopoverPosition({
          top: rect.top - 8, // Small offset for visual spacing
          left: rect.left
        });
      }
    };

    // Initial update
    updatePosition();
    
    // Update on resize and scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    // Listen for sidebar toggling
    const sidebarToggleButton = document.querySelector('[aria-label="Toggle sidebar"]');
    if (sidebarToggleButton) {
      sidebarToggleButton.addEventListener('click', () => {
        setTimeout(updatePosition, 350); // After sidebar animation
      });
    }
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isMobile]);

  return { popoverWidth, popoverPosition };
}
