import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { makeStyles } from '../theme';

import { LoadingOrError } from './LoadingOrError';

type Props = {
  loading?: boolean;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

export function LoadingOverlay(props: Props) {
  const styles = useStyles();
  const { loading = false, opacity = 0.5, style } = props;

  return (
    <>
      <View
        style={[
          styles.floatCenter,
          styles.loadingBackground,
          style,
          { opacity },
        ]}
      />
      <LoadingOrError loading={loading} style={styles.floatCenter} />
    </>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  floatCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBackground: { backgroundColor: colors.background },
}));
