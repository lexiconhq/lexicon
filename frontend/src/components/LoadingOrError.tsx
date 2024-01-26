import React, { useEffect } from 'react';
import {
  StyleProp,
  ScrollView,
  View,
  ViewStyle,
  RefreshControl,
  RefreshControlProps,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ActivityIndicator, Text } from '../core-ui';
import { showLogoutAlert } from '../helpers';
import { makeStyles, useTheme } from '../theme';
import { StackNavProp } from '../types';
import { useAuth } from '../utils/AuthProvider';
import { ERROR_NOT_FOUND } from '../constants';

type Props = Pick<RefreshControlProps, 'progressViewOffset' | 'onRefresh'> & {
  message?: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  refreshing?: boolean;
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
  const { colors } = useTheme();
  const {
    loading = false,
    message = loading
      ? t('Loading...')
      : t('Something unexpected happened. Please try again'),
    onRefresh,
    style,
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
