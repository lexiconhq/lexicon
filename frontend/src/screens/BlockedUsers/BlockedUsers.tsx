import React from 'react';
import { FlatList, View } from 'react-native';

import { CustomHeader } from '../../components';
import { Button, Text } from '../../core-ui';
import { useBlockUserActions } from '../../helpers';
import { makeStyles } from '../../theme';
import { useBlockedUsers } from '../../utils';

export default function BlockedUsers() {
  const styles = useStyles();
  const { blockedUsernamesList } = useBlockedUsers();
  const { promptUnblock, isUpdating, isLoggedIn } = useBlockUserActions();

  return (
    <View style={styles.container}>
      <CustomHeader title={t('Blocked Users')} />
      <View style={styles.content}>
        <Text style={styles.description}>
          {isLoggedIn
            ? t(
                'Users you block are hidden in this app and ignored on the forum. Unblock anyone below to show their content again.',
              )
            : t(
                'Users you block are hidden in this app. Sign in to sync blocks to the forum. You can unblock anyone below.',
              )}
        </Text>
        {blockedUsernamesList.length === 0 ? (
          <View style={styles.empty}>
            <Text color="textLight" style={styles.emptyText}>
              {t('You have not blocked anyone yet.')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={blockedUsernamesList}
            keyExtractor={(username) => username}
            contentContainerStyle={styles.listContent}
            renderItem={({ item: username }) => (
              <View style={styles.row}>
                <Text variant="semiBold" style={styles.username}>
                  @{username}
                </Text>
                <Button
                  content={t('Unblock')}
                  outline
                  disabled={isUpdating}
                  onPress={() => promptUnblock(username)}
                  style={styles.unblockButton}
                />
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
  },
  description: {
    color: colors.textLight,
    marginBottom: spacing.xl,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  username: {
    flex: 1,
    marginRight: spacing.m,
  },
  unblockButton: {
    minWidth: 100,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    textAlign: 'center',
  },
}));
