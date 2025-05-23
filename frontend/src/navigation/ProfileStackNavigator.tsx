import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import {
  Activity,
  AddEmail,
  ChangePassword,
  EditProfile,
  EditUSerStatus,
  EmailAddress,
  Messages,
  Notifications,
  Preferences,
  Profile,
} from '../screens';
import { useTheme } from '../theme';
import { RootStackParamList } from '../types';

const ProfileStack = createStackNavigator<RootStackParamList>();

export default function ProfileStackNavigator() {
  const { navHeader } = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        ...navHeader,
        presentation: 'card',
        headerBackTestID: 'HeaderBackButton',
      }}
      initialRouteName="ProfileScreen"
    >
      <ProfileStack.Screen
        name="ProfileScreen"
        component={Profile}
        options={{ title: '' }}
      />
      <ProfileStack.Screen
        name="Messages"
        component={Messages}
        options={{ title: t('Messages') }}
      />
      <ProfileStack.Screen
        name="AddEmail"
        component={AddEmail}
        options={{ title: t('New Email Address') }}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: t('Change Password') }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: t('Edit Profile') }}
      />
      <ProfileStack.Screen
        name="EmailAddress"
        component={EmailAddress}
        options={{ title: t('Email Address') }}
      />
      <ProfileStack.Screen
        name="EditUserStatus"
        component={EditUSerStatus}
        options={{ title: '' }}
      />
      <ProfileStack.Screen
        name="Preferences"
        component={Preferences}
        options={{ title: t('Preferences') }}
      />
      <ProfileStack.Screen
        name="Notifications"
        component={Notifications}
        options={{ title: t('Notifications') }}
      />
      <ProfileStack.Screen
        name="Activity"
        component={Activity}
        options={{ title: t('Activity') }}
      />
    </ProfileStack.Navigator>
  );
}
