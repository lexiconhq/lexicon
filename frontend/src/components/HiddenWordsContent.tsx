import React from 'react';
import { View } from 'react-native';

import { Text } from '../core-ui';
import { makeStyles } from '../theme';

export function HiddenWordsContent() {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text variant="semiBold" style={styles.title}>
        {t('Hidden content')}
      </Text>
      <Text style={styles.description}>
        {t(
          'This content is hidden because it matches a word on your Hidden Words list. Manage hidden words in Profile settings.',
        )}
      </Text>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  description: {
    textAlign: 'center',
    color: colors.textLight,
  },
}));
