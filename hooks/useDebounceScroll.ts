import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for debounced scroll event handling
 * @param callback - Function to call on scroll
 * @param delay - Debounce delay in milliseconds (default: 100ms)
 */
export const useDebounceScroll = (
  callback: () => void,
  delay: number = 100,
): void => {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedScroll = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      callbackRef.current();
    }, delay);
  }, [delay]);

  useEffect(() => {
    // Call immediately on mount
    callback();

    // Add debounced listener
    globalThis.addEventListener("scroll", debouncedScroll);

    return () => {
      // Cleanup
      globalThis.removeEventListener("scroll", debouncedScroll);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedScroll]);
};
