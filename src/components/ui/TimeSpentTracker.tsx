import React, { useEffect, useRef } from 'react';
import useAnalytics from '@/hooks/useAnalytics';

interface TimeSpentTrackerProps {
  intervals?: number[]; // Array of time intervals to track in seconds, e.g. [30, 60, 120, 300]
  path?: string; // Optional path override (defaults to current pathname)
}

const TimeSpentTracker: React.FC<TimeSpentTrackerProps> = ({
  intervals = [30, 60, 120, 180, 300, 600],
  path,
}) => {
  const { trackTimeSpent } = useAnalytics();
  const trackedIntervalsRef = useRef<Set<number>>(new Set());
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentPath = path || window.location.pathname;
  const pathRef = useRef<string>(currentPath);

  useEffect(() => {
    // Reset when path changes
    if (pathRef.current !== currentPath) {
      trackedIntervalsRef.current = new Set();
      startTimeRef.current = Date.now();
      pathRef.current = currentPath;
    }

    const checkTimeIntervals = () => {
      const secondsSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

      intervals.forEach(interval => {
        if (secondsSpent >= interval && !trackedIntervalsRef.current.has(interval)) {
          trackTimeSpent(interval, currentPath);
          trackedIntervalsRef.current.add(interval);
        }
      });
    };

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start the timer that checks time intervals
    timerRef.current = setInterval(checkTimeIntervals, 5000); // Check every 5 seconds

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Track final time spent when component unmounts
      const finalSecondsSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (finalSecondsSpent >= 5) { // Only track if spent at least 5 seconds
        trackTimeSpent(finalSecondsSpent, currentPath);
      }
    };
  }, [intervals, trackTimeSpent, currentPath]);

  // This component doesn't render anything
  return null;
};

export default TimeSpentTracker;
