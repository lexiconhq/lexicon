import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';

export function useUpdateApp() {
  const [loading, setLoading] = useState(false);

  const checkUpdate = async () => {
    const { isAvailable } = await Updates.checkForUpdateAsync();
    if (isAvailable) {
      setLoading(true);
      performUpdate();
    }
  };

  const performUpdate = async () => {
    Updates.fetchUpdateAsync()
      .then(() => {
        reloadApp();
      })
      .catch(() => {
        reloadApp();
      });
  };

  const reloadApp = async () => {
    await Updates.reloadAsync();
  };

  useEffect(() => {
    if (!__DEV__) {
      checkUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
  };
}
