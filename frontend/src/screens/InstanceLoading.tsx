import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { LoadingOrError } from '../components';
import { StackNavProp } from '../types';
import { useSiteSettings } from '../hooks';
import { makeStyles } from '../theme';

export default function Loading() {
  const { reset } = useNavigation<StackNavProp<'Login'>>();
  const {
    loading,
    canSignUp,
    error: siteSettingsError,
  } = useSiteSettings({ fetchPolicy: 'network-only' });
  const styles = useStyles();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!siteSettingsError || canSignUp) {
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
  }, [canSignUp, siteSettingsError, loading, reset]);

  return (
    <View style={styles.background}>
      {loading && <LoadingOrError loading />}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
}));
