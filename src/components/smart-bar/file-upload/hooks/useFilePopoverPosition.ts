
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
      if (!showPopover || typeof window === 'undefined') return;
      
      // Find the SmartBar container
      const smartBarContainer = document.querySelector('.SmartBar');
                                
      if (smartBarContainer) {
        const rect = smartBarContainer.getBoundingClientRect();
        
        // Calculate width based on the SmartBar's width
        const width = Math.min(rect.width, 768); // Max width of 768px
        setPopoverWidth(width);
        
        // Calculate position to be above the SmartBar
        setPopoverPosition({
          top: rect.top + window.scrollY,
          left: rect.left + (rect.width - width) / 2 // Center horizontally
        });

        console.info("Popover position updated:", { 
          top: rect.top + window.scrollY,
          left: rect.left + (rect.width - width) / 2,
          width
        });
      } else {
        console.warn("SmartBar container not found");
      }
    };
    
    if (showPopover) {
      // Initial update
      updateSmartBarDimensions();
      
      // Run it again after a small delay to ensure DOM is fully rendered
      const initialTimer = setTimeout(updateSmartBarDimensions, 100);
      
      // Update on resize and scroll
      window.addEventListener('resize', updateSmartBarDimensions);
      window.addEventListener('scroll', updateSmartBarDimensions);
      
      // Update when sidebar state changes
      const sidebarToggleBtn = document.querySelector('[aria-label="Toggle sidebar"]');
      if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
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
