import { ExtendedCategory } from '@/types/video';

// Cache configuration
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const CACHE_KEY = 'awesome-video-cache';
const CACHE_TIMESTAMP_KEY = 'awesome-video-cache-timestamp';

// Helper function to safely interact with localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  }
};

// In-memory cache as a fallback
let memoryCache: ExtendedCategory[] | null = null;
let memoryTimestamp = 0;

export const getCachedData = (): {
  data: ExtendedCategory[] | null,
  isFresh: boolean
} => {
  const currentTime = Date.now();

  // Try to get data from localStorage first
  try {
    const timestampStr = safeLocalStorage.getItem(CACHE_TIMESTAMP_KEY);
    const timestamp = timestampStr ? parseInt(timestampStr, 10) : 0;
    const isFresh = timestamp && (currentTime - timestamp < CACHE_DURATION);

    if (isFresh) {
      const cachedDataStr = safeLocalStorage.getItem(CACHE_KEY);
      if (cachedDataStr) {
        console.log('Cache: Using fresh localStorage data');
        const cachedData = JSON.parse(cachedDataStr) as ExtendedCategory[];

        // Update memory cache for faster access
        memoryCache = cachedData;
        memoryTimestamp = timestamp;

        return {
          data: cachedData,
          isFresh: true
        };
      }
    }
  } catch (error) {
    console.error('Error parsing cache from localStorage:', error);
  }

  // Fall back to memory cache if localStorage failed
  const isMemoryCacheFresh = memoryCache && (currentTime - memoryTimestamp < CACHE_DURATION);
  if (isMemoryCacheFresh) {
    console.log('Cache: Using fresh memory cache');
    return {
      data: memoryCache,
      isFresh: true
    };
  }

  console.log('Cache: No fresh cache available');
  return {
    data: null,
    isFresh: false
  };
};

export const updateCache = (data: ExtendedCategory[]): void => {
  const timestamp = Date.now();

  // Update memory cache
  memoryCache = data;
  memoryTimestamp = timestamp;

  // Try to update localStorage cache
  try {
    const success = safeLocalStorage.setItem(CACHE_KEY, JSON.stringify(data)) &&
                   safeLocalStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toString());

    if (success) {
      console.log('Cache: Successfully updated localStorage cache');
    } else {
      console.warn('Cache: Failed to update localStorage cache, using memory cache only');
    }
  } catch (error) {
    console.error('Cache: Error updating localStorage cache:', error);
  }

  console.log(`Cache: Updated cache with ${data.length} categories at ${new Date(timestamp).toLocaleTimeString()}`);
};
