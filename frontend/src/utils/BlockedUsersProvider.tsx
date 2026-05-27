import { useLazyQuery, useReactiveVar } from '@apollo/client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';

import {
  ProfileDocument,
  ProfileQuery,
  ProfileQueryVariables,
} from '../generatedAPI/server';
import {
  getBlocksToSyncToDiscourse,
  mergeBlockedUsernames,
  normalizeUsername,
} from '../helpers/blockedUsers';
import { errorHandlerAlert, useStorage } from '../helpers';
import { useIgnoreUser } from '../hooks/rest/profile/useIgnoreUser';
import { tokenVar } from '../reactiveVars';

type BlockedUsersContextValue = {
  blockedUsernames: Set<string>;
  blockedUsernamesList: Array<string>;
  isBlocked: (username: string | undefined | null) => boolean;
  blockUser: (username: string) => Promise<void>;
  unblockUser: (username: string) => Promise<void>;
  isUpdating: boolean;
  refreshBlockedFromDiscourse: () => Promise<Array<string>>;
  syncLocalBlocksToDiscourse: (
    discourseIgnored?: Array<string>,
  ) => Promise<void>;
};

const BlockedUsersContext = createContext<BlockedUsersContextValue | undefined>(
  undefined,
);

function blockedSetsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) {
    return false;
  }
  for (const username of a) {
    if (!b.has(username)) {
      return false;
    }
  }
  return true;
}

function addPendingServerBlock(
  storage: ReturnType<typeof useStorage>,
  username: string,
) {
  const normalized = normalizeUsername(username);
  const pending = storage.getItem('pendingServerBlockSync') ?? [];
  if (!pending.map(normalizeUsername).includes(normalized)) {
    storage.setItem('pendingServerBlockSync', [...pending, username]);
  }
}

function removePendingServerBlock(
  storage: ReturnType<typeof useStorage>,
  username: string,
) {
  const normalized = normalizeUsername(username);
  const pending = storage.getItem('pendingServerBlockSync') ?? [];
  storage.setItem(
    'pendingServerBlockSync',
    pending.filter((entry) => normalizeUsername(entry) !== normalized),
  );
}

export function BlockedUsersProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const storage = useStorage();
  const token = useReactiveVar(tokenVar);
  const [blockedUsernames, setBlockedUsernames] = useState<Set<string>>(
    new Set(),
  );
  const [discourseIgnoredUsernames, setDiscourseIgnoredUsernames] = useState<
    Array<string>
  >([]);
  const isSyncingRef = useRef(false);

  const [getProfile] = useLazyQuery<ProfileQuery, ProfileQueryVariables>(
    ProfileDocument,
    { fetchPolicy: 'network-only' },
  );

  const applyBlockedState = useCallback(
    (localOnly: Array<string>, discourseIgnored: Array<string>) => {
      const merged = mergeBlockedUsernames(localOnly, discourseIgnored);
      const next = new Set(merged);

      setBlockedUsernames((prev) =>
        blockedSetsEqual(prev, next) ? prev : next,
      );

      const storedLocal = storage.getItem('locallyBlockedUsernames') ?? [];
      const normalizedLocal = localOnly.map(normalizeUsername);
      const normalizedStored = storedLocal.map(normalizeUsername);
      if (normalizedStored.join('\0') !== normalizedLocal.join('\0')) {
        storage.setItem('locallyBlockedUsernames', localOnly);
      }
    },
    [storage],
  );

  const handleIgnoreError = useCallback((error: { message: string }) => {
    errorHandlerAlert(error.message);
  }, []);

  const refreshBlockedFromDiscourse = useCallback(async () => {
    const currentUsername = storage.getItem('user')?.username;
    if (!currentUsername || !token) {
      setDiscourseIgnoredUsernames([]);
      const localOnly = storage.getItem('locallyBlockedUsernames') ?? [];
      applyBlockedState(localOnly, []);
      return [];
    }

    const result = await getProfile({
      variables: { username: currentUsername, skipNotifications: true },
    });

    const ignoredUsernames =
      result.data?.profile.user.ignoredUsernames ?? [];
    setDiscourseIgnoredUsernames(ignoredUsernames);

    const localOnly = storage.getItem('locallyBlockedUsernames') ?? [];
    applyBlockedState(localOnly, ignoredUsernames);

    return ignoredUsernames;
  }, [applyBlockedState, getProfile, storage, token]);

  const { ignoreUser, unignoreUser, loading: isUpdating } = useIgnoreUser({
    onUserError: handleIgnoreError,
  });

  const syncLocalBlocksToDiscourse = useCallback(async (
    discourseIgnoredOverride?: Array<string>,
  ) => {
    if (!token || isSyncingRef.current) {
      return;
    }

    const currentUsername = storage.getItem('user')?.username;
    const pending = storage.getItem('pendingServerBlockSync') ?? [];
    const discourseIgnored =
      discourseIgnoredOverride ?? discourseIgnoredUsernames;
    const toSync = getBlocksToSyncToDiscourse({
      pending,
      discourseIgnored,
      currentUsername,
    });

    if (!toSync.length) {
      if (!pending.length) {
        return;
      }
      storage.setItem('pendingServerBlockSync', []);
      return;
    }

    isSyncingRef.current = true;
    const stillPending: Array<string> = [];

    for (const username of toSync) {
      try {
        await ignoreUser(username, { silent: true });
        removePendingServerBlock(storage, username);
      } catch {
        stillPending.push(username);
      }
    }

    isSyncingRef.current = false;
    storage.setItem('pendingServerBlockSync', stillPending);

    if (stillPending.length > 0) {
      console.warn(
        `BlockedUsers: ${stillPending.length} block(s) could not sync to Discourse.`,
      );
    }

    await refreshBlockedFromDiscourse();
  }, [
    discourseIgnoredUsernames,
    ignoreUser,
    refreshBlockedFromDiscourse,
    storage,
    token,
  ]);

  useEffect(() => {
    const localOnly = storage.getItem('locallyBlockedUsernames') ?? [];
    applyBlockedState(localOnly, []);
    // Hydrate from local storage once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshBlockedRef = useRef(refreshBlockedFromDiscourse);
  const syncLocalBlocksRef = useRef(syncLocalBlocksToDiscourse);
  refreshBlockedRef.current = refreshBlockedFromDiscourse;
  syncLocalBlocksRef.current = syncLocalBlocksToDiscourse;

  useEffect(() => {
    if (!token) {
      setDiscourseIgnoredUsernames([]);
      return;
    }

    let cancelled = false;

    (async () => {
      const ignored = await refreshBlockedRef.current();
      if (cancelled) {
        return;
      }

      const pending = storage.getItem('pendingServerBlockSync') ?? [];
      const needsSync =
        getBlocksToSyncToDiscourse({
          pending,
          discourseIgnored: ignored,
          currentUsername: storage.getItem('user')?.username,
        }).length > 0;

      if (needsSync) {
        await syncLocalBlocksRef.current(ignored);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [storage, token]);

  const isBlocked = useCallback(
    (username: string | undefined | null) => {
      if (!username) {
        return false;
      }
      return blockedUsernames.has(normalizeUsername(username));
    },
    [blockedUsernames],
  );

  const blockUser = useCallback(
    async (username: string) => {
      const normalized = normalizeUsername(username);
      const currentUsername = storage.getItem('user')?.username;
      if (normalized === normalizeUsername(currentUsername ?? '')) {
        return;
      }

      const local = storage.getItem('locallyBlockedUsernames') ?? [];
      if (!local.map(normalizeUsername).includes(normalized)) {
        applyBlockedState([...local, username], discourseIgnoredUsernames);
      }

      if (!token) {
        addPendingServerBlock(storage, username);
        return;
      }

      try {
        await ignoreUser(username);
        removePendingServerBlock(storage, username);
        await refreshBlockedFromDiscourse();
      } catch {
        addPendingServerBlock(storage, username);
        Alert.alert(
          t('Error'),
          t(
            'Unable to block this user on the server. Their content is hidden locally and will sync when possible.',
          ),
        );
      }
    },
    [
      applyBlockedState,
      discourseIgnoredUsernames,
      ignoreUser,
      refreshBlockedFromDiscourse,
      storage,
      token,
    ],
  );

  const unblockUser = useCallback(
    async (username: string) => {
      const normalized = normalizeUsername(username);
      const local = storage.getItem('locallyBlockedUsernames') ?? [];
      applyBlockedState(
        local.filter((entry) => normalizeUsername(entry) !== normalized),
        discourseIgnoredUsernames,
      );
      removePendingServerBlock(storage, username);

      if (!token) {
        return;
      }

      try {
        await unignoreUser(username);
        await refreshBlockedFromDiscourse();
      } catch {
        Alert.alert(
          t('Error'),
          t('Unable to unblock this user on the server. Please try again.'),
        );
      }
    },
    [
      applyBlockedState,
      discourseIgnoredUsernames,
      refreshBlockedFromDiscourse,
      storage,
      token,
      unignoreUser,
    ],
  );

  const blockedUsernamesList = useMemo(
    () => Array.from(blockedUsernames).sort((a, b) => a.localeCompare(b)),
    [blockedUsernames],
  );

  const value = useMemo(
    () => ({
      blockedUsernames,
      blockedUsernamesList,
      isBlocked,
      blockUser,
      unblockUser,
      isUpdating,
      refreshBlockedFromDiscourse,
      syncLocalBlocksToDiscourse,
    }),
    [
      blockedUsernames,
      blockedUsernamesList,
      blockUser,
      isBlocked,
      isUpdating,
      refreshBlockedFromDiscourse,
      syncLocalBlocksToDiscourse,
      unblockUser,
    ],
  );

  return (
    <BlockedUsersContext.Provider value={value}>
      {children}
    </BlockedUsersContext.Provider>
  );
}

export function useBlockedUsers() {
  const context = useContext(BlockedUsersContext);
  if (!context) {
    throw new Error('useBlockedUsers must be used within BlockedUsersProvider');
  }
  return context;
}
