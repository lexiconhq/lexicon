import React from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from '../core-ui';
import { makeStyles } from '../theme';

type Props = {
  isHidden?: boolean;
};

export function FooterLoadingIndicator(props: Props) {
  const styles = useStyles();

  const { isHidden = false } = props;

  return isHidden ? null : (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    width: '100%',
    paddingVertical: spacing.xxl,
    justifyContent: 'center',
  },
}));
