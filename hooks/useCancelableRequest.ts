import { useEffect, useRef } from "react";

/**
 * Custom hook for cancellable fetch requests
 * Automatically cancels pending requests when component unmounts
 *
 * @returns AbortController instance and helper functions
 *
 * @example
 * const abortController = useCancelableRequest();
 *
 * useEffect(() => {
 *   fetchData(abortController.signal);
 *   return () => abortController.abort();
 * }, []);
 */
export const useCancelableRequest = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Create new AbortController on mount
    abortControllerRef.current = new AbortController();

    // Cleanup: abort any pending requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    signal: abortControllerRef.current?.signal,
    abort: () => abortControllerRef.current?.abort(),
    getNewController: () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      return abortControllerRef.current;
    },
  };
};

/**
 * Wrapper for fetch that checks if request was cancelled
 * @param error - Error from fetch
 * @returns true if request was cancelled
 */
export const isRequestCancelled = (error: unknown): boolean => {
  return error instanceof Error && error.name === "AbortError";
};
