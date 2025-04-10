import { useReactiveVar } from '@apollo/client';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { currentScreenVar } from '../constants';
import { Icon, Text } from '../core-ui';
import { useKeyboardListener } from '../hooks';
import {
  Home as HomeScene,
  PostDraft,
  Profile as ProfileScene,
} from '../screens';
import { makeStyles, useTheme } from '../theme';
import { TabParamList } from '../types';
import { useDevice } from '../utils';
import { useAuth } from '../utils/AuthProvider';

import { navigate } from './NavigationService';
import ProfileDrawerNavigator from './ProfileDrawerNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<TabParamList>();

function TabBar({ state, navigation: { navigate } }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const useAuthResults = useAuth();
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
          const token = !useAuthResults.isLoading && useAuthResults.token;
          if (state.index === 0 && state.index === index) {
            navigate(route.name, { backToTop: true });
          } else {
            if (route.name === 'Profile' && !token) {
              navigate('Welcome');
              return;
            }
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
                {route.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  const { isTablet, isPortrait } = useDevice();
  let currentScreen = useReactiveVar(currentScreenVar);
  const useAuthResults = useAuth();
  const token = !useAuthResults.isLoading && useAuthResults.token;

  useEffect(() => {
    const checkScreenOrientation = async () => {
      const currentOrientation = await ScreenOrientation.getOrientationAsync();
      let { screen, params } = currentScreen;

      if (
        currentOrientation === 1 ||
        currentOrientation === 3 ||
        currentOrientation === 4
      ) {
        if (screen !== 'ProfileScreen') {
          navigate([screen, params]);
        }
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
  }, [currentScreen]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScene}
        options={{ headerShown: false }}
      />
      {token && <Tab.Screen name="Draft" component={PostDraft} />}
      {!isTablet ? (
        <Tab.Screen
          name="Profile"
          component={ProfileScene}
          options={{ headerShown: false }}
        />
      ) : isPortrait ? (
        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <Tab.Screen
          name="Profile"
          component={ProfileDrawerNavigator}
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
