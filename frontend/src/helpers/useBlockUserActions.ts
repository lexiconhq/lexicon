import { useReactiveVar } from '@apollo/client';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { tokenVar } from '../reactiveVars';
import { useBlockedUsers } from '../utils';

import { normalizeUsername } from './blockedUsers';
import { useStorage } from './localStorage';

export function useBlockUserActions() {
  const storage = useStorage();
  const token = useReactiveVar(tokenVar);
  const { isBlocked, blockUser, unblockUser, isUpdating } = useBlockedUsers();

  const currentUsername = storage.getItem('user')?.username;

  const canBlockUsername = useCallback(
    (username: string | undefined | null) => {
      if (!username) {
        return false;
      }
      return (
        normalizeUsername(username) !==
        normalizeUsername(currentUsername ?? '')
      );
    },
    [currentUsername],
  );

  const promptBlock = useCallback(
    (username: string) => {
      Alert.alert(
        t('Block user'),
        token
          ? t(
              'Block {username}? Their profile, posts, and reactions will be hidden in this app, and they will be ignored on the forum.',
              { username },
            )
          : t(
              'Block {username}? Their content will be hidden in this app. After you sign in, this block will sync to the forum.',
              { username },
            ),
        [
          { text: t('Cancel'), style: 'cancel' },
          {
            text: t('Block'),
            style: 'destructive',
            onPress: () => {
              blockUser(username);
            },
          },
        ],
      );
    },
    [blockUser, token],
  );

  const promptUnblock = useCallback(
    (username: string) => {
      Alert.alert(
        t('Unblock user'),
        t('Unblock {username}? Their content will be visible again in this app.', {
          username,
        }),
        [
          { text: t('Cancel'), style: 'cancel' },
          {
            text: t('Unblock'),
            onPress: () => {
              unblockUser(username);
            },
          },
        ],
      );
    },
    [unblockUser],
  );

  const toggleBlock = useCallback(
    (username: string) => {
      if (isBlocked(username)) {
        promptUnblock(username);
      } else {
        promptBlock(username);
      }
    },
    [isBlocked, promptBlock, promptUnblock],
  );

  return {
    canBlockUsername,
    isBlocked,
    promptBlock,
    promptUnblock,
    toggleBlock,
    blockUser,
    unblockUser,
    isUpdating,
    isLoggedIn: !!token,
  };
}
