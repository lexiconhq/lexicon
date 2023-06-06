import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  Activity,
  AddEmail,
  ChangePassword,
  EditProfile,
  EmailAddress,
  ImagePreview,
  InstanceLoading,
  Login,
  MessageDetail,
  Messages,
  Notifications,
  PostDetail,
  Preferences,
  Register,
  Search,
  TwoFactorAuth,
  UserInformation,
} from '../screens';
import { useTheme } from '../theme';
import { StackParamList } from '../types';

import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<StackParamList>();

export default function StackNavigator() {
  const { navHeader } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="InstanceLoading"
      screenOptions={{ ...navHeader, presentation: 'card' }}
    >
      <Stack.Screen
        name="TabNav"
        component={TabNavigator}
        options={{ title: '', headerShown: false }}
      />
      <Stack.Screen
        name="InstanceLoading"
        component={InstanceLoading}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Activity"
        component={Activity}
        options={{ title: t('Activity') }}
      />
      <Stack.Screen
        name="AddEmail"
        component={AddEmail}
        options={{ title: t('New Email Address') }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: t('Change Password') }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="EmailAddress"
        component={EmailAddress}
        options={{ title: t('Email Address') }}
      />
      <Stack.Screen
        name="ImagePreview"
        component={ImagePreview}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={Login} options={{ title: '' }} />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{ title: t('Messages') }}
      />
      <Stack.Screen
        name="MessageDetail"
        component={MessageDetail}
        options={{ title: t('Message') }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ title: t('Notifications') }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetail}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: t('Register') }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Preferences"
        component={Preferences}
        options={{ title: t('Preferences') }}
      />
      <Stack.Screen
        name="TwoFactorAuth"
        component={TwoFactorAuth}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="UserInformation"
        component={UserInformation}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
