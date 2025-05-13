import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * Provides a cancel method to cancel delayed invocations.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFunction = function(...args: Parameters<T>) {
    // Clear the previous timeout (if any) to reset the timer
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }

    // Schedule the function call after the specified wait time
    // And ensure we're capturing the current args
    timeout = setTimeout(() => {
      timeout = null;
      console.log(`Debounce timer executed after ${wait}ms`);
      func(...args);
    }, wait);
  };

  // Add cancel method to clear the timeout
  (debouncedFunction as any).cancel = function() {
    if (timeout !== null) {
      console.log('Debounced function canceled');
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFunction as any;
}
