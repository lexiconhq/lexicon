import React from 'react';
import { View } from 'react-native';

import { Button, Text } from '../core-ui';
import { makeStyles } from '../theme';

type Props = {
  username: string;
  onUnblock?: () => void;
  showUnblock?: boolean;
  isUpdating?: boolean;
};

export function BlockedUserContent(props: Props) {
  const { username, onUnblock, showUnblock = false, isUpdating = false } = props;
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text variant="semiBold" style={styles.title}>
        {t('Blocked user')}
      </Text>
      <Text style={styles.description}>
        {t(
          'You have blocked {username}. Their profile, posts, and reactions are hidden in this app.',
          { username },
        )}
      </Text>
      {showUnblock && onUnblock ? (
        <Button
          content={t('Unblock')}
          outline
          disabled={isUpdating}
          onPress={onUnblock}
          style={styles.button}
        />
      ) : null}
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
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 160,
  },
}));
