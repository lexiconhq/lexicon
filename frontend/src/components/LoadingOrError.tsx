import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ActivityIndicator, Text } from '../core-ui';
import { showLogoutAlert } from '../helpers';
import { makeStyles } from '../theme';
import { StackNavProp } from '../types';
import { useAuth } from '../utils/AuthProvider';
import { ERROR_NOT_FOUND } from '../constants';

type Props = {
  message?: string;
  loading?: boolean;
};

export function LoadingOrError(props: Props) {
  const { reset } = useNavigation<StackNavProp<'Login'>>();
  const { cleanSession } = useAuth();
  const { message } = props;
  useEffect(() => {
    if (message === ERROR_NOT_FOUND) {
      /**
       * This is a legacy implementation that should be refactored
       * We don't want to mixed this view layer with Auth logic
       * https://github.com/kodefox/lexicon/issues/1097
       */
      cleanSession();
      reset({ index: 0, routes: [{ name: 'Login' }] });
      showLogoutAlert();
    }
  }, [message, reset, cleanSession]);

  return <LoadingOrErrorView {...props} />;
}

export function LoadingOrErrorView(props: Props) {
  const styles = useStyles();
  const {
    loading = false,
    message = loading
      ? t('Loading...')
      : t('Something unexpected happened. Please try again'),
  } = props;

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="small" /> : null}
      <Text>{message}</Text>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
}));
