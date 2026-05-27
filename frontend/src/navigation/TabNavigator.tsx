import { useReactiveVar } from '@apollo/client';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useRef } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { currentScreenVar } from '../constants';
import { navigateToProfileTab } from '../helpers/navigateInProfile';
import { Icon, Text } from '../core-ui';
import { ProfileNavigatorParamList } from '../types';
import { useKeyboardListener } from '../hooks';
import {
  ChannelChat as ChannelChatScene,
  Home as HomeScene,
  PostDraft,
} from '../screens';
import ProfileGuest from '../screens/Profile/ProfileGuest';
import { makeStyles, useTheme } from '../theme';
import { TabParamList } from '../types';
import { useDevice } from '../utils';
import { useAuth } from '../utils/AuthProvider';

import { navigationRef } from './NavigationService';
import ProfileDrawerNavigator from './ProfileDrawerNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<TabParamList>();

function ProfileTabScreen() {
  const { isTabletLandscape } = useDevice();

  return (
    <View
      key={isTabletLandscape ? 'profile-drawer' : 'profile-stack'}
      style={{ flex: 1 }}
    >
      {isTabletLandscape ? (
        <ProfileDrawerNavigator />
      ) : (
        <ProfileStackNavigator />
      )}
    </View>
  );
}

function isProfileTabActive(): boolean {
  if (!navigationRef.isReady()) {
    return false;
  }

  const rootState = navigationRef.getRootState();
  const tabRoute = rootState.routes[rootState.index];
  if (tabRoute.name !== 'TabNav' || !tabRoute.state) {
    return false;
  }

  const activeTab = tabRoute.state.routes[tabRoute.state.index ?? 0];
  return activeTab.name === 'Profile';
}

function TabBar({
  state,
  navigation: { navigate },
  token,
}: BottomTabBarProps & { token: boolean }) {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const { isTabletLandscape } = useDevice();
  const { isKeyboardVisible } = useKeyboardListener();

  return (
    <View
      style={[
        styles.tabContainer,
        styles.tabContainerBorder,
        { display: isTabletLandscape && isKeyboardVisible ? 'none' : 'flex' },
      ]}
    >
      {state.routes.map((route: { name: string }, index: number) => {
        const onPress = async () => {
          if (route.name === 'Profile' && isTabletLandscape) {
            navigateToProfileTab('ProfileScreen');
            return;
          }

          if (state.index === 0 && state.index === index) {
            navigate(route.name, { backToTop: true });
          } else {
            navigate(route.name, { backToTop: false });
          }
        };

        return (
          <TouchableOpacity
            key={state.routes[index].key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={state.index === index ? 1 : 0.2}
            testID={
              route.name === 'Profile'
                ? 'Tab:Profile'
                : route.name === 'Chat'
                ? 'Tab:Chat'
                : route.name === 'Draft'
                ? 'Tab:Draft'
                : 'Tab:Home'
            }
          >
            <View
              style={[
                { paddingBottom: insets.bottom },
                styles.tabItemContainer,
              ]}
            >
              <Icon
                name={
                  route.name === 'Home'
                    ? 'Home'
                    : route.name === 'Chat'
                    ? 'ChatBubble'
                    : route.name === 'Draft'
                    ? 'Draft'
                    : 'Person'
                }
                size="xl"
                color={
                  state.index === index ? colors.activeTab : colors.inactiveTab
                }
              />
              <Text
                color={state.index === index ? 'activeTab' : 'inactiveTab'}
                size="xs"
              >
                {route.name === 'Chat' ? 'Live Chat' : route.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  const { isTablet, isTabletLandscape } = useDevice();
  const { colors } = useTheme();
  const useAuthResults = useAuth();
  const token = !useAuthResults.isLoading && !!useAuthResults.token;
  let currentScreen = useReactiveVar(currentScreenVar);

  useEffect(() => {
    if (!isTablet) {
      return;
    }

    const checkScreenOrientation = async () => {
      const currentOrientation = await ScreenOrientation.getOrientationAsync();
      let { screen, params } = currentScreen;

      const isLandscape =
        currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

      if (isLandscape) {
        navigateToProfileTab(
          screen as keyof ProfileNavigatorParamList,
          params as ProfileNavigatorParamList[keyof ProfileNavigatorParamList],
        );
      } else if (screen !== 'ProfileScreen') {
        navigateToProfileTab(
          screen as keyof ProfileNavigatorParamList,
          params as ProfileNavigatorParamList[keyof ProfileNavigatorParamList],
        );
      } else {
        navigateToProfileTab('ProfileScreen');
      }
    };

    /**
     * Change orientation detection to use ScreenOrientation because the dimensions listener has a bug where it doesn't call the listener on the first rotation.
     */
    // Add event listener for dimensions change
    const subscription = ScreenOrientation.addOrientationChangeListener(
      checkScreenOrientation,
    );

    // Initial check
    checkScreenOrientation();

    // Cleanup event listener
    return () => {
      subscription.remove();
    };
  }, [currentScreen, isTablet]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <TabBar token={token} {...props} />}
      sceneContainerStyle={{ backgroundColor: colors.background }}
      detachInactiveScreens={false}
    >
      <Tab.Screen
        name="Home"
        component={HomeScene}
        options={{ headerShown: false }}
      />
      {token && (
        <>
          <Tab.Screen
            name="Chat"
            component={ChannelChatScene}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Draft" component={PostDraft} />
        </>
      )}

      {!token ? (
        <Tab.Screen
          name="Profile"
          component={ProfileGuest}
          options={{ headerShown: false }}
        />
      ) : (
        <Tab.Screen
          name="Profile"
          component={ProfileTabScreen}
          options={{ headerShown: false }}
        />
      )}
    </Tab.Navigator>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  tabContainerBorder: { borderWidth: 0.2, borderColor: colors.border },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 15 : '3%',
  },
  tabItemContainer: {
    alignItems: 'center',
  },
}));
