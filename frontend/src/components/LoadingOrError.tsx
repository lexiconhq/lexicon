import React from 'react';
import {
  StyleProp,
  ScrollView,
  View,
  ViewStyle,
  RefreshControl,
  RefreshControlProps,
} from 'react-native';

import { ActivityIndicator, Text } from '../core-ui';
import { makeStyles, useTheme } from '../theme';

type Props = Pick<RefreshControlProps, 'progressViewOffset' | 'onRefresh'> & {
  message?: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  refreshing?: boolean;
};

export function LoadingOrError(props: Props) {
  return <LoadingOrErrorView {...props} />;
}

export function LoadingOrErrorView(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const {
    loading = false,
    message = loading
      ? t('Loading...')
      : t('Something unexpected happened. Please try again'),
    style,
    onRefresh,
    refreshing,
    progressViewOffset,
  } = props;

  return onRefresh ? (
    <ScrollView
      contentContainerStyle={[styles.scrollViewContentStyle, style]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || false}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          progressViewOffset={progressViewOffset}
        />
      }
    >
      <View style={styles.container}>
        {loading ? <ActivityIndicator size="small" /> : null}
        <Text>{message}</Text>
      </View>
    </ScrollView>
  ) : (
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
  scrollViewContentStyle: { flex: 1 },
}));
