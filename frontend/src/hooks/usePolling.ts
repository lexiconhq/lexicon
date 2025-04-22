import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

type PollingProps = {
  fetchFn: () => void; // Function to call for fetching
  interval: number; // Interval for polling in milliseconds
  shouldPoll: boolean; // Flag to control whether polling should start
  onStop?: () => void; // Optional cleanup function after polling stops
};

export function usePolling({
  fetchFn,
  interval,
  shouldPoll,
  onStop,
}: PollingProps) {
  const isFocused = useIsFocused();
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isFocused && shouldPoll && !isTimeoutActive) {
      setIsTimeoutActive(true);
      timeout = setInterval(() => {
        fetchFn(); // Call the fetch function passed to the hook
      }, interval);

      // Cleanup function when component unmounts or polling stops
      return () => {
        clearInterval(timeout);
        setIsTimeoutActive(false);
        if (onStop) {
          onStop();
        }
      };
    } else {
      setIsTimeoutActive(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, shouldPoll]);

  return isTimeoutActive;
}
