
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
      
      const smartBarForm = document.querySelector('form.rounded-xl, form.rounded-2xl');
      if (smartBarForm) {
        const rect = smartBarForm.getBoundingClientRect();
        
        setPopoverWidth(rect.width);
        // Adjust the left position based on sidebar state if not mobile
        const leftPosition = isMobile ? rect.left : rect.left;
        
        setPopoverPosition({
          top: rect.top - 12,
          left: leftPosition
        });
      }
    };
    
    if (showPopover) {
      updateSmartBarDimensions();
      window.addEventListener('resize', updateSmartBarDimensions);
      window.addEventListener('scroll', updateSmartBarDimensions);
      
      // Also listen for sidebar toggling
      const sidebarToggleButton = document.querySelector('[aria-label="Toggle sidebar"]');
      if (sidebarToggleButton) {
        sidebarToggleButton.addEventListener('click', () => {
          // Add a small delay to allow DOM to update
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
