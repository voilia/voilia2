
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Hook to prevent body scrolling issues on mobile devices,
 * especially when keyboard is open or when using fixed position elements
 */
export function useMobileScroll() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    // Apply mobile-specific styles to prevent scroll issues
    const applyMobileScrollFixes = () => {
      // Prevent body scrolling while maintaining inner scroll areas
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Prevent overscroll behavior
      document.documentElement.style.overscrollBehavior = 'none';
      
      // Add iOS touch scrolling to inner elements
      const scrollableElements = document.querySelectorAll('[data-radix-scroll-area-viewport]');
      scrollableElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.WebkitOverflowScrolling = 'touch';
        }
      });
    };

    // Apply fixes on mount
    applyMobileScrollFixes();

    // Handle orientation changes
    const handleResize = () => {
      // Small timeout to let the browser settle after orientation change
      setTimeout(applyMobileScrollFixes, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Clean up
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.documentElement.style.overscrollBehavior = '';

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile]);
}
