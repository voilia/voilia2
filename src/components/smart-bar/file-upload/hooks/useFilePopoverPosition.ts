
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
      
      // Find the SmartBar container - use multiple selectors to ensure we find it
      const smartBarContainer = document.querySelector('.SmartBar') || 
                                document.querySelector('form.rounded-xl') || 
                                document.querySelector('.relative.max-w-3xl.mx-auto.w-full');
                                
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
      // Initial update
      updateSmartBarDimensions();
      
      // Small timeout to ensure DOM is ready
      const initialTimer = setTimeout(updateSmartBarDimensions, 50);
      
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
        clearTimeout(initialTimer);
        window.removeEventListener('resize', updateSmartBarDimensions);
        window.removeEventListener('scroll', updateSmartBarDimensions);
      };
    }
  }, [showPopover, isMobile]);

  return { popoverWidth, popoverPosition };
}
