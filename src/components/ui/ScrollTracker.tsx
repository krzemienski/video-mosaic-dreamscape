import React, { useEffect, useState } from 'react';
import useAnalytics from '@/hooks/useAnalytics';

interface ScrollTrackerProps {
  thresholds?: number[]; // Array of percentage thresholds to track (e.g., [25, 50, 75, 100])
  debounceTime?: number; // Debounce time in ms
  path?: string; // Optional path override (defaults to current pathname)
}

const ScrollTracker: React.FC<ScrollTrackerProps> = ({
  thresholds = [25, 50, 75, 90, 100],
  debounceTime = 500,
  path,
}) => {
  const { trackScrollDepth } = useAnalytics();
  const [trackedThresholds, setTrackedThresholds] = useState<Set<number>>(new Set());
  const currentPath = path || window.location.pathname;

  useEffect(() => {
    // Reset tracked thresholds when path changes
    setTrackedThresholds(new Set());
  }, [currentPath]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        // Calculate the current scroll percentage
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const totalHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        ) - window.innerHeight;

        if (totalHeight <= 0) return; // Avoid division by zero

        const scrollPercentage = Math.min(Math.floor((scrollTop / totalHeight) * 100), 100);

        // Check if we've passed any new thresholds
        thresholds.forEach(threshold => {
          if (scrollPercentage >= threshold && !trackedThresholds.has(threshold)) {
            trackScrollDepth(threshold, currentPath);
            setTrackedThresholds(prev => new Set([...prev, threshold]));
          }
        });
      }, debounceTime);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [thresholds, trackedThresholds, trackScrollDepth, debounceTime, currentPath]);

  // This component doesn't render anything
  return null;
};

export default ScrollTracker;
