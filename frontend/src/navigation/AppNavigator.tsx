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
import { getToken, navigatePostOrMessageDetail } from '../helpers';
import { useRedirect } from '../utils';

import RootStackNavigator from './RootStackNavigator';
import { navigationRef } from './NavigationService';

export default function AppNavigator() {
  const { colorScheme } = useColorScheme();
  const { setRedirectPath } = useRedirect();
  const darkMode = colorScheme === 'dark';

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [EXPO_PREFIX],
    config: { screens: DEEP_LINK_SCREEN_CONFIG },
    subscribe: onSubscribe,
    async getInitialURL() {
      // First, you may want to do the default deep link handling
      // Check if app was opened from a deep link
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl == null) {
        return initialUrl;
      }

      // Handle URL from expo push notifications
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        return handleUrl(response);
      }

      const [, pathname] = initialUrl.split('://');
      if (!pathname) {
        return;
      }

      const [route] = pathname.split('/');
      if (route && isPostOrMessageDetail(route)) {
        setRedirectPath(pathname);
      }
      return initialUrl;
    },
    getStateFromPath: (fullPath, config) => {
      // Split off any search params (`?a=1&b=2`)
      // Then, Extract the leading part of the path as the `route`.
      // e.g., `'post-detail'`.
      // The remainder of the params are `pathParams`.
      // e.g., `['11', '3']`, representing `topicId` and `postNumber`, respectively.
      const [pathname] = fullPath.split('?');
      const [route, ...pathParams] = pathname.split('/');

      // If we're not on a known deep link path, fallback to the default behavior
      // from React Navigation.
      if (!isPostOrMessageDetail(route)) {
        return getStateFromPath(fullPath, config);
      }

      getToken().then((token) => {
        if (!token) {
          setRedirectPath(pathname);
          return;
        }

        // From here on out, we know that `route` is either `message-detail` | `post-detail`.
        navigatePostOrMessageDetail(route, pathParams);
      });
    },
  };

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <NavigationContainer
        linking={linking}
        theme={darkMode ? DarkTheme : DefaultTheme}
        ref={navigationRef}
      >
        <RootStackNavigator />
      </NavigationContainer>
    </>
  );
}
