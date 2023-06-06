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

import { useColorScheme } from '../theme';
import { RootStackParamList } from '../types';
import { DEEP_LINK_SCREEN_CONFIG, isPostOrMessageDetail } from '../constants';
import { navigatePostOrMessageDetail } from '../helpers';

import RootStackNavigator from './RootStackNavigator';
import { navigationRef } from './NavigationService';

export default function AppNavigator() {
  const { colorScheme } = useColorScheme();
  const darkMode = colorScheme === 'dark';

  const prefix = Linking.createURL('/');
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [prefix], // NOTE: Add app scheme prefix, ex: 'exp://'
    config: { screens: DEEP_LINK_SCREEN_CONFIG },
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

      // From here on out, we know that `route` is either `message-detail` | `post-detail`.
      navigatePostOrMessageDetail(route, pathParams);
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
