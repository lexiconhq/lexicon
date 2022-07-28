import React from 'react';
import * as Font from 'expo-font';
import { CourierPrime_400Regular as Courier } from '@expo-google-fonts/courier-prime';
import { CodedError } from 'expo-modules-core';

const loadFonts = async () => {
  return Font.loadAsync({
    // `Courier` is no longer included in iOS 15. We'll use `CourierPrime` as a
    // fallback for now. This is due to our dependency, `react-native-markdown-display`.
    Courier,
  });
};

export default function useLoadFonts() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      try {
        await loadFonts();
      } catch (error: unknown) {
        let codedError = error as CodedError;
        setError(codedError.message ?? null);
      }

      setLoading(false);
    };

    load();
  }, [setLoading]);

  return { loading, error };
}
