import React from 'react';
import * as Font from 'expo-font';
import { CourierPrime_400Regular as Courier } from '@expo-google-fonts/courier-prime';

import { CodedErrorExpoModuleSchema } from '../types';

const loadFonts = async () => {
  return Font.loadAsync({
    // `Courier` is no longer included in iOS 15. We'll use `CourierPrime` as a
    // fallback for now. This is due to our dependency, `react-native-markdown-display`.
    Courier,
  });
};

export default function useLoadFonts() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>('');

  React.useEffect(() => {
    const load = async () => {
      try {
        await loadFonts();
      } catch (error: unknown) {
        const errorResult = CodedErrorExpoModuleSchema.safeParse(error);
        setError(errorResult.success ? errorResult.data.message ?? null : null);
      }

      setLoading(false);
    };

    load();
  }, [setLoading]);

  return { loading, error };
}
