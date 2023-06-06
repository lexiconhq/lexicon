import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  Channels,
  DarkMode,
  FlagPost,
  Hyperlink,
  NewMessage,
  NewMessagePreview,
  NewPost,
  PostImagePreview,
  PostPreview,
  PostReply,
  SelectUser,
  Tags,
  Troubleshoot,
} from '../screens';
import { useTheme } from '../theme';
import { RootStackParamList } from '../types';

import StackNavigator from './StackNavigator';

const RootStack = createStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { navHeader, navModal, navNoShadow, shadow } = useTheme();

  return (
    <RootStack.Navigator
      screenOptions={{ ...navHeader, ...navModal, presentation: 'modal' }}
    >
      <RootStack.Screen
        name="Main"
        component={StackNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Channels"
        component={Channels}
        options={{ title: t('Channels'), ...navNoShadow, ...navModal }}
        initialParams={{ prevScreen: 'Home', selectedChannelId: 0 }}
      />
      <RootStack.Screen
        name="FlagPost"
        component={FlagPost}
        options={{ title: t('Flag'), ...navModal }}
      />
      <RootStack.Screen
        name="HyperLink"
        component={Hyperlink}
        options={{ ...navModal }}
      />
      <RootStack.Screen
        name="NewMessage"
        component={NewMessage}
        options={{ title: t('New Message'), ...navModal, ...navNoShadow }}
        initialParams={{ users: [] }}
      />
      <RootStack.Screen
        name="NewMessagePreview"
        component={NewMessagePreview}
        options={{ title: t('New Message'), ...navModal }}
      />
      <RootStack.Screen
        name="NewPost"
        component={NewPost}
        initialParams={{ selectedChannelId: 1, selectedTagsIds: [] }}
        options={{ title: t('New Post'), ...navModal }}
      />
      <RootStack.Screen
        name="PostPreview"
        component={PostPreview}
        options={{ title: t('New Post'), ...navModal }}
      />
      <RootStack.Screen
        name="PostReply"
        component={PostReply}
        options={{ title: '', ...navModal }}
      />
      <RootStack.Screen
        name="SelectUser"
        component={SelectUser}
        options={{ title: t('Select User'), ...navModal, ...navNoShadow }}
      />
      <RootStack.Screen
        name="PostImagePreview"
        component={PostImagePreview}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Tags"
        component={Tags}
        initialParams={{ selectedTagsIds: [] }}
        options={{ title: t('Tags'), ...navModal }}
      />
      <RootStack.Screen
        name="DarkMode"
        component={DarkMode}
        options={{ title: t('Dark Mode'), ...navModal }}
      />
      <RootStack.Screen
        name="Troubleshoot"
        component={Troubleshoot}
        options={{ title: t('Error Details'), headerStyle: shadow }}
      />
    </RootStack.Navigator>
  );
}
