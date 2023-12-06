import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  getStateFromPath,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

import { useColorScheme } from '../theme';
import { RootStackParamList } from '../types';
import {
  DEEP_LINK_SCREEN_CONFIG,
  EXPO_PREFIX,
  handleUrl,
  isPostOrMessageDetail,
  onSubscribe,
} from '../constants';
import { isRouteBesidePost, postOrMessageDetailPathToRoutes } from '../helpers';
import { useRedirect } from '../utils';
import { useInitialLoad } from '../hooks/useInitialLoad';
import { LoadingOrErrorView } from '../components';
import { useAuth } from '../utils/AuthProvider';

import RootStackNavigator from './RootStackNavigator';
import { navigationRef } from './NavigationService';

export default function AppNavigator() {
  const { colorScheme } = useColorScheme();
  const useInitialLoadResult = useInitialLoad();
  const { setRedirectPath } = useRedirect();
  const auth = useAuth();

  const darkMode = colorScheme === 'dark';

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      {useInitialLoadResult.loading || auth.isLoading ? (
        <LoadingOrErrorView loading />
      ) : (
        <NavigationContainer
          linking={createLinkingConfig({
            setRedirectPath,
            isLoggedIn: useInitialLoadResult.isLoggedIn,
            isPublicDiscourse: useInitialLoadResult.isPublicDiscourse,
          })}
          theme={darkMode ? DarkTheme : DefaultTheme}
          ref={navigationRef}
        >
          <RootStackNavigator authProps={auth} />
        </NavigationContainer>
      )}
    </>
  );
}

type CreateLinkingConfigParams = {
  setRedirectPath: (path: string) => void;
  isLoggedIn: boolean;
  isPublicDiscourse: boolean;
};
const createLinkingConfig = (params: CreateLinkingConfigParams) => {
  const { setRedirectPath, isLoggedIn, isPublicDiscourse } = params;
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [EXPO_PREFIX],
    config: { screens: DEEP_LINK_SCREEN_CONFIG },
    subscribe: onSubscribe,
    async getInitialURL() {
      // Handle app was opened from a deep link

      const url = await Linking.getInitialURL();

      if (url != null) {
        return url;
      }

      // Handle app was opened from expo push notification

      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        return handleUrl(response);
      }
    },
    getStateFromPath: (fullPath, config) => {
      // Split off any search params (`?a=1&b=2`)
      // Then, Extract the leading part of the path as the `route`.
      // e.g., `'post-detail'`.
      // The remainder of the params are `pathParams`.
      // e.g., `['11', '3']`, representing `topicId` and `postNumber`, respectively.
      const [pathname] = fullPath.split('?');
      const [route, ...pathParams] = pathname.split('/');

      const routeToLogin = { routes: [{ name: 'Login' }] };
      // If we're not on a known deep link path, fallback to the default behavior
      // from React Navigation.
      if (!isPostOrMessageDetail(route)) {
        return getStateFromPath(fullPath, config);
      }

      if (!isLoggedIn) {
        setRedirectPath(pathname);
        /**
         * it will check if deep link is for beside post it will require user to login scene
         * for example in this case is message-detail where user must be login to send message
         *
         * And for another condition, we want to redirect the user to the login scene if the discourse is not publicly accessible and the user is not logged in.
         */

        if (isRouteBesidePost(route) || !isPublicDiscourse) {
          return routeToLogin;
        }
      }

      let routes = postOrMessageDetailPathToRoutes({ route, pathParams });

      return {
        routes,
        index: routes.length - 1,
      };
    },
  };
  return linking;
};
