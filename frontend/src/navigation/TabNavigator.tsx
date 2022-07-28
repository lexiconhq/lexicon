import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { Icon, Text } from '../core-ui';
import { getToken } from '../helpers';
import { Home as HomeScene, Profile as ProfileScene } from '../screens';
import { makeStyles, useTheme } from '../theme';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

function TabBar({ state, navigation: { navigate } }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route: { name: string }, index: number) => {
        const onPress = async () => {
          const token = await getToken();
          if (state.index === 0 && state.index === index) {
            navigate(route.name, { backToTop: true });
          } else {
            if (route.name === 'Profile' && !token) {
              navigate('Login');
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
          >
            <View
              style={[
                { paddingBottom: insets.bottom },
                styles.tabItemContainer,
              ]}
            >
              <Icon
                name={route.name === 'Home' ? 'Home' : 'Person'}
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
      <Tab.Screen
        name="Profile"
        component={ProfileScene}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 0.2,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 15 : '3%',
  },
  tabItemContainer: {
    alignItems: 'center',
  },
}));
