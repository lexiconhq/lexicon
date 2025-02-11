import { ApolloError, useReactiveVar } from '@apollo/client';
import React, {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { Alert } from 'react-native';

import { client } from '../api/client';
import { ERROR_REFETCH, errorTypes } from '../constants';
import {
  LoginError,
  getToken,
  removeToken,
  setToken,
  useStorage,
} from '../helpers';
import { useSiteSettings } from '../hooks';
import { setTokenState, tokenVar } from '../reactiveVars';

const { sessionExpired, unauthorizedAccess } = errorTypes;

/**
 * isLoading is true when we are still loading token from storage or SiteSettings request still loading.
 */
export type AuthContextProps = {
  setTokenState: (token: string | null) => void;
  cleanSession: () => Promise<void>;
} & (
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      token: string | null;
      canSignUp?: boolean;
      loginRequired?: boolean;
      siteSettingsError?: ApolloError;
    }
);

const AuthContext = createContext<AuthContextProps>({
  isLoading: true,
  setTokenState: () => {},
  cleanSession: async () => {},
});

type AuthProviderProps = {
  children: ReactElement;
};
/**
 * Context provider for authentication.
 * This provider will handle all data related to authentication.
 * The data currently consist of token and user data
 * Our AsyncStorage will be synced by this provider (as a side effect).
 * To logout user, we need to set token to null, all side effects related to logout will be handled by this provider.
 * Navigation isn't included in the scope of this provider
 * if we want to navigate based on the auth state we will do it manually (current approach)
 * or we implement it on navigator level (future approach) https://reactnavigation.org/docs/auth-flow
 * this future approach tracked under this issue https://github.com/kodefox/lexicon/issues/1098
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  /**
   * We determined user logged in or not by checking token state.
   */
  const token = useReactiveVar(tokenVar);

  const storage = useStorage();
  const {
    canSignUp,
    loginRequired,
    loading: siteSettingsLoading,
    error: siteSettingsError,
  } = useSiteSettings({
    onCompleted: ({ site }) => {
      const {
        discourseBaseUrl,
        siteSettings: {
          emojiSet,
          externalEmojiUrl,
          allowPoll,
          pollCreateMinimumTrustLevel,
        },
      } = site;
      storage.setItem('userStatus', {
        emojiSet,
        externalEmojiUrl,
        discourseBaseUrl,
      });
      storage.setItem('poll', {
        allowPoll,
        pollCreateMinimumTrustLevel,
      });
    },
    onError: ({ message }) => {
      if (
        message.includes(sessionExpired) ||
        message.includes(unauthorizedAccess)
      ) {
        /**
         * clean session when session expired or unauthorized access and token exist
         * check docs/authentication.md for more info
         */
        if (tokenVar()) {
          cleanSession();
        }
      }
    },
    fetchPolicy: 'network-only',
    skip: token === undefined,
  });

  useEffect(() => {
    // load token from storage on initial mount
    const loadTokenToState = async () => {
      const asyncStorageToken = await getToken();
      tokenVar(asyncStorageToken);
    };
    loadTokenToState();
  }, []);

  useEffect(() => {
    /**
     * sync token in storage with state and handle side effects needed when user logged out
     */
    const syncToken = async () => {
      const asyncStorageToken = await getToken();
      if (asyncStorageToken === token) {
        return;
      }
      if (token === undefined) {
        /**
         * token is undefined when we are still loading token from storage
         * it means we don't need to do any side effects to sync
         */
        return;
      }
      if (token == null) {
        /**
         * token is null when user logged out (either voluntary or session expired)
         * in this case we need to do side effects to clean up session related data
         */
        await removeToken();
        storage.removeItem('user');
        storage.removeItem('homeChannelId');
        return;
      }
      /**
       * token exist mean user successfully logged in
       * in this case we need to do side effects to set the token to storage
       */
      await setToken(token);
    };
    syncToken();
  }, [token, storage]);
  const authContextProps: AuthContextProps = useMemo(() => {
    const baseProviderValue = {
      cleanSession,
      setTokenState,
    };
    return {
      ...baseProviderValue,
      ...(siteSettingsLoading || token === undefined
        ? { isLoading: true }
        : {
            isLoading: false,
            token,
            canSignUp,
            loginRequired,
            siteSettingsError,
          }),
    };
  }, [canSignUp, loginRequired, siteSettingsError, siteSettingsLoading, token]);

  return (
    <AuthContext.Provider value={authContextProps}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

const cleanSession = async () => {
  tokenVar(null);
  /**
   * Move client.clearStore from AuthProvider side effect sync to here
   * to make sure the store is cleared when the session expired
   * before we navigating away from the page
   */
  await client.clearStore();
  try {
    await client.refetchQueries({
      include: ['Site'],
    });
  } catch (error) {
    // For condition error at site after error change into get graphQLErrors with value "You need to be logged in to do that."
    // after logout
    if (
      error instanceof ApolloError &&
      Array.isArray(error.graphQLErrors) &&
      error.graphQLErrors[0] === LoginError
    ) {
      /**
       * we don't expose unauthorizedAccess error to user
       * because we already handle it in AuthProvider onError on useSiteSettings
       */
      return;
    }
    Alert.alert(ERROR_REFETCH);
  }
};
