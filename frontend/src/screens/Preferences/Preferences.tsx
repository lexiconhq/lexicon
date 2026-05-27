import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { View } from 'react-native';

import { makeStyles } from '../../theme';
import { StackNavProp } from '../../types';

/**
 * Legacy route kept for deep links. Settings live on the Profile tab menu.
 */
export default function Preferences() {
  const styles = useStyles();
  const { goBack } = useNavigation<StackNavProp<'Preferences'>>();

  useEffect(() => {
    goBack();
  }, [goBack]);

  return <View style={styles.container} />;
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
}));
