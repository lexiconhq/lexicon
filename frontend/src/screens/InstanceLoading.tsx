import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { LoadingOrError } from '../components';
import { useSiteSettings } from '../hooks';
import { StackNavProp } from '../types';
import useLoadFonts from '../hooks/useLoadFonts';
import { removeToken, useStorage } from '../helpers';
import { discourseHostVar, errorTypes } from '../constants';
import { useRedirect } from '../utils';
import { useHealthQuery } from '../generated/server';

const { sessionExpired, unauthorizedAccess } = errorTypes;

export default function Loading() {
  const { reset } = useNavigation<StackNavProp<'Login'>>();
  const { removeItem } = useStorage();
  const { redirectPath, setRedirectPath, handleRedirect } = useRedirect();

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

  let { loading: getHostLoading } = useHealthQuery({
    onCompleted: ({ health }) => {
      if (health.discourseHost) {
        // NOTE: `discourseHostVar` has nothing to do with the health check
        // We needed the Discourse host for In-App Linking (#1012), so we are
        // opportunistically grabbing it when we already have it from the health check.
        discourseHostVar(health.discourseHost);
      }
    },
  });

  const loading = fontsLoading || settingsLoading || getHostLoading;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!settingsError || canSignUp) {
      if (redirectPath) {
        handleRedirect();
        setRedirectPath('');
      } else {
        reset({ index: 0, routes: [{ name: 'TabNav' }] });
      }
    } else {
      // TODO: We should only do this if error is the specific
      // login error from Discourse.
      // Otherwise, we should display some kind of indicator that
      // an unexpected error has occurred.
      // At a minimum, we could display it on the Login scene with login disabled,
      // contact an administrator, etc.
      reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }, [
    canSignUp,
    handleRedirect,
    loading,
    redirectPath,
    reset,
    setRedirectPath,
    settingsError,
  ]);

  return <>{loading && <LoadingOrError loading />}</>;
}
