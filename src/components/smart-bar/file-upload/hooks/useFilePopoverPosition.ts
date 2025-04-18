
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PopoverPosition {
  top: number;
  left: number;
}

export function useFilePopoverPosition(showPopover: boolean) {
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({ top: 0, left: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateSmartBarDimensions = () => {
      if (typeof window === 'undefined') return;
      
      // Find the SmartBar container
      const smartBarContainer = document.querySelector('.SmartBar, form.rounded-xl, .relative.max-w-3xl');
      if (smartBarContainer) {
        const rect = smartBarContainer.getBoundingClientRect();
        
        setPopoverWidth(rect.width);
        
        // Calculate position to be exactly above the smartbar
        setPopoverPosition({
          top: rect.top,
          left: rect.left
        });
      }
    };
    
    if (showPopover) {
      // Small timeout to ensure DOM is ready
      setTimeout(updateSmartBarDimensions, 0);
      
      // Update on resize and scroll
      window.addEventListener('resize', updateSmartBarDimensions);
      window.addEventListener('scroll', updateSmartBarDimensions);
      
      // Listen for sidebar toggling
      const sidebarToggleButton = document.querySelector('[aria-label="Toggle sidebar"]');
      if (sidebarToggleButton) {
        sidebarToggleButton.addEventListener('click', () => {
          setTimeout(updateSmartBarDimensions, 350);
        });
      }
      
      return () => {
        window.removeEventListener('resize', updateSmartBarDimensions);
        window.removeEventListener('scroll', updateSmartBarDimensions);
      };
    }
  }, [showPopover, isMobile]);

  return { popoverWidth, popoverPosition };
}
