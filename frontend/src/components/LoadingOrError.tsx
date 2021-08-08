import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ActivityIndicator, Text } from '../core-ui';
import { removeToken, showLogoutAlert, useStorage } from '../helpers';
import { makeStyles } from '../theme';

type Props = {
  message?: string;
  loading?: boolean;
};

export function LoadingOrError(props: Props) {
  const { reset } = useNavigation();
  const storage = useStorage();
  const styles = useStyles();

  const {
    loading = false,
    message = loading
      ? t('Loading...')
      : t('Something unexpected happened. Please try again'),
  } = props;

  if (message === 'Not found or private') {
    removeToken();
    storage.removeItem('user');
    reset({ index: 0, routes: [{ name: 'Login' }] });
    showLogoutAlert();
  }

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
