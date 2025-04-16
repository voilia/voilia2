
import { useRef, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCall = useRef(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall.current;

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }

      if (timeSinceLastCall >= delay) {
        lastCall.current = now;
        callback(...args);
      } else {
        timeoutId.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
          timeoutId.current = null;
        }, delay - timeSinceLastCall);
      }
    },
    [callback, delay]
  );

  return throttledFn;
}
