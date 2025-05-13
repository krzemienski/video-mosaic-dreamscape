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
  let lastArgs: Parameters<T> | null = null;

  // The function that will be returned
  const debouncedFunction = function(...args: Parameters<T>) {
    // Store the latest arguments
    lastArgs = args;
    console.log(`⏱️ Debounce: Function called with args:`, args[0]);

    // Clear the previous timeout (if any) to reset the timer
    if (timeout !== null) {
      console.log(`⏱️ Debounce: Clearing previous timeout`);
      clearTimeout(timeout);
      timeout = null;
    }

    // Schedule the function call after the specified wait time
    console.log(`⏱️ Debounce: Setting timeout for ${wait}ms`);

    timeout = setTimeout(() => {
      console.log(`⏱️ Debounce: Timeout fired after ${wait}ms`);
      // Capture arguments in case they changed
      const currentArgs = lastArgs;
      // Clear refs
      timeout = null;
      lastArgs = null;

      // Actually execute the function
      if (currentArgs) {
        console.log(`⏱️ Debounce: Executing function with args:`, currentArgs[0]);
        try {
          func(...currentArgs);
          console.log(`⏱️ Debounce: Function executed successfully`);
        } catch (error) {
          console.error(`⏱️ Debounce: Error executing function:`, error);
        }
      } else {
        console.error(`⏱️ Debounce: No arguments available for execution`);
      }
    }, wait);
  };

  // Add cancel method to clear the timeout
  (debouncedFunction as any).cancel = function() {
    console.log('⏱️ Debounce: Cancel called');
    if (timeout !== null) {
      console.log('⏱️ Debounce: Canceling active timeout');
      clearTimeout(timeout);
      timeout = null;
      lastArgs = null;
    } else {
      console.log('⏱️ Debounce: No active timeout to cancel');
    }
  };

  return debouncedFunction as any;
}
