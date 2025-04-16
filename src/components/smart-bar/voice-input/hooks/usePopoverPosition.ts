
import { useState, useEffect } from "react";

export function usePopoverPosition() {
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updateSmartBarDimensions = () => {
      if (typeof window === 'undefined') return;
      
      const smartBarForm = document.querySelector('form.rounded-2xl');
      if (smartBarForm) {
        const rect = smartBarForm.getBoundingClientRect();
        
        setPopoverWidth(rect.width);
        setPopoverPosition({
          top: rect.top - 12,
          left: rect.left
        });
      }
    };
    
    updateSmartBarDimensions();
    window.addEventListener('resize', updateSmartBarDimensions);
    window.addEventListener('scroll', updateSmartBarDimensions);
    
    return () => {
      window.removeEventListener('resize', updateSmartBarDimensions);
      window.removeEventListener('scroll', updateSmartBarDimensions);
    };
  }, []);

  return { popoverWidth, popoverPosition };
}
