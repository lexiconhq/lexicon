import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { LoadingOrError } from '../components';
import { useSiteSettings } from '../hooks';
import { StackNavProp } from '../types';
import useLoadFonts from '../hooks/useLoadFonts';

export default function Loading() {
  const { reset } = useNavigation<StackNavProp<'Login'>>();
  // TODO: Make use of error from useLoadFonts
  const { loading: fontsLoading } = useLoadFonts();

  const {
    canSignUp,
    loading: settingsLoading,
    error: settingsError,
  } = useSiteSettings();

  const loading = fontsLoading || settingsLoading;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!settingsError || canSignUp) {
      reset({ index: 0, routes: [{ name: 'TabNav' }] });
    } else {
      // TODO: We should only do this if error is the specific
      // login error from Discourse.
      // Otherwise, we should display some kind of indicator that
      // an unexpected error has occurred.
      // At a minimum, we could display it on the Login scene with login disabled,
      // contact an administrator, etc.
      reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }, [loading, settingsError, canSignUp, reset]);

  return <>{settingsLoading && <LoadingOrError loading />}</>;
}
