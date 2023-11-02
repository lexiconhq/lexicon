import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { ActivityIndicator, Text } from '../core-ui';
import { makeStyles } from '../theme';

type Props = {
  message?: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function LoadingOrError(props: Props) {
  return <LoadingOrErrorView {...props} />;
}

export function LoadingOrErrorView(props: Props) {
  const styles = useStyles();
  const {
    loading = false,
    message = loading
      ? t('Loading...')
      : t('Something unexpected happened. Please try again'),
    style,
  } = props;

  return (
    <View style={[styles.container, style]}>
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
