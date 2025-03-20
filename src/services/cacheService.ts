
import { ExtendedCategory } from '@/types/video';

// Cache configuration
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
let lastFetchTime = 0;
let awesomeVideoCache: ExtendedCategory[] | null = null;

export const getCachedData = (): { 
  data: ExtendedCategory[] | null, 
  isFresh: boolean 
} => {
  const currentTime = Date.now();
  const isFresh = awesomeVideoCache && (currentTime - lastFetchTime < CACHE_DURATION);
  
  return {
    data: awesomeVideoCache,
    isFresh
  };
};

export const updateCache = (data: ExtendedCategory[]): void => {
  awesomeVideoCache = data;
  lastFetchTime = Date.now();
};
