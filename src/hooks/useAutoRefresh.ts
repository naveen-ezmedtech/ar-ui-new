import { useRef, useEffect } from 'react';

export const useAutoRefresh = (
  callback: () => void,
  intervalMs: number = 10000,
  maxRefreshes: number = 12
) => {
  const intervalRef = useRef<number | null>(null);
  const countRef = useRef(0);

  const start = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    countRef.current = 0;
    intervalRef.current = window.setInterval(() => {
      if (countRef.current < maxRefreshes) {
        callback();
        countRef.current++;
      } else {
        stop();
      }
    }, intervalMs);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return { start, stop };
};

