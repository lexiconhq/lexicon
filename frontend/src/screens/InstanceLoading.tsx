import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { LoadingOrError } from '../components';
import { useSiteSettings } from '../hooks';
import { StackNavProp } from '../types';
import useLoadFonts from '../hooks/useLoadFonts';
import { removeToken, useStorage } from '../helpers';
import { errorTypes } from '../constants';

const { sessionExpired, unauthorizedAccess } = errorTypes;

export default function Loading() {
  const { reset } = useNavigation<StackNavProp<'Login'>>();
  const { removeItem } = useStorage();
  // TODO: Make use of error from useLoadFonts
  const { loading: fontsLoading } = useLoadFonts();

  const {
    canSignUp,
    loading: settingsLoading,
    error: settingsError,
  } = useSiteSettings({
    onError: ({ message }) => {
      if (
        message.includes(sessionExpired) ||
        message.includes(unauthorizedAccess)
      ) {
        /**
         * Making sure token and user data are removed either when the session expired
         * or when the discourse instance is private and users are not authenticated.
         *
         * Can't remove the user data item from the storage in error link,
         * so we do that here.
         */
        removeToken();
        removeItem('user');
      }
    },
  });

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
