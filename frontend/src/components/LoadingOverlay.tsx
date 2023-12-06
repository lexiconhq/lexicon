import React from 'react';
import { View } from 'react-native';

import { Color, makeStyles, useTheme } from '../theme';

import { LoadingOrError } from './LoadingOrError';

type Props = {
  loading?: boolean;
  opacity?: number;
  backgroundColor?: Color;
};

export function LoadingOverlay(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const {
    loading = false,
    opacity = 0.5,
    backgroundColor = 'background',
  } = props;

  return (
    <>
      <View
        style={[
          styles.floatCenter,
          { backgroundColor: colors[backgroundColor], opacity },
        ]}
      />
      <LoadingOrError loading={loading} style={styles.floatCenter} />
    </>
  );
}

const useStyles = makeStyles(() => ({
  floatCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
