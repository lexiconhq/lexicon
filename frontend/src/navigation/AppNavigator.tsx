import {
  DarkTheme,
  DefaultTheme,
  getStateFromPath,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';

import { LoadingOrErrorView } from '../components';
import {
  DEEP_LINK_SCREEN_CONFIG,
  EXPO_PREFIX,
  handleUrl,
  isChatOrThread,
  isRouteAvailable,
  onSubscribe,
} from '../constants';
import {
  chatOrThreadPathToRoutes,
  isRouteBesidePost,
  postOrMessageDetailPathToRoutes,
} from '../helpers';
import { useInitialLoad } from '../hooks/useInitialLoad';
import { useUpdateApp } from '../hooks/useUpdateApp';
import { makeStyles, useColorScheme } from '../theme';
import { RootStackParamList } from '../types';
import { useDevice, useRedirect } from '../utils';
import { useAuth } from '../utils/AuthProvider';

import { navigationRef } from './NavigationService';
import RootStackNavigator from './RootStackNavigator';

export default function AppNavigator() {
  const { colorScheme } = useColorScheme();
  const useInitialLoadResult = useInitialLoad();
  const { setRedirectPath } = useRedirect();
  const auth = useAuth();
  const styles = useStyles();
  const { loading: appUpdateLoading } = useUpdateApp();
  const { isTablet, isTabletLandscape } = useDevice();

  const darkMode = colorScheme === 'dark';

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      {useInitialLoadResult.loading || auth.isLoading || appUpdateLoading ? (
        <LoadingOrErrorView loading style={styles.background} />
      ) : (
        <View style={styles.background}>
          <NavigationContainer
            linking={createLinkingConfig({
              setRedirectPath,
              isLoggedIn: useInitialLoadResult.isLoggedIn,
              isPublicDiscourse: useInitialLoadResult.isPublicDiscourse,
              isTablet,
              isTabletLandscape,
            })}
            theme={darkMode ? DarkTheme : DefaultTheme}
            ref={navigationRef}
          >
            <RootStackNavigator authProps={auth} />
          </NavigationContainer>
        </View>
      )}
    </>
  );
}

type CreateLinkingConfigParams = {
  setRedirectPath: (path: string) => void;
  isLoggedIn: boolean;
  isPublicDiscourse: boolean;
  isTablet?: boolean;
  isTabletLandscape?: boolean;
};
const createLinkingConfig = (params: CreateLinkingConfigParams) => {
  const {
    setRedirectPath,
    isLoggedIn,
    isPublicDiscourse,
    isTablet,
    isTabletLandscape,
  } = params;
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

      const routeToLogin = { routes: [{ name: 'Welcome' }] };
      // If we're not on a known deep link path, fallback to the default behavior
      // from React Navigation.
      if (!isRouteAvailable(route)) {
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

      const routes = isChatOrThread(route)
        ? chatOrThreadPathToRoutes({ route, pathParams })
        : postOrMessageDetailPathToRoutes({
            route,
            pathParams,
            isTablet,
            isTabletLandscape,
          });

      return {
        routes,
        index: Math.max(routes.length - 1, 0), // Ensures valid index
      };
    },
  };
  return linking;
};

const useStyles = makeStyles(({ colors }) => ({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
}));
