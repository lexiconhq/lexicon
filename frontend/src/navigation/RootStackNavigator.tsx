import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import {
  Activity,
  AddEmail,
  AuthenticationWebView,
  ChangePassword,
  Channels,
  ChatChannelDetail,
  DarkMode,
  EditPollsList,
  EditProfile,
  EditUSerStatus,
  EmailAddress,
  EmojiPicker,
  FlagPost,
  Hyperlink,
  ImagePreview,
  MessageDetail,
  Messages,
  NewMessage,
  NewPoll,
  NewPost,
  Notifications,
  Poll,
  PostDetail,
  PostImagePreview,
  PostPreview,
  PostReply,
  Preferences,
  PushNotifications,
  Search,
  SelectUser,
  StackAvatarModal,
  Tags,
  ThreadDetails,
  Troubleshoot,
  UserInformation,
  Welcome,
} from '../screens';
import { useTheme } from '../theme';
import { RootStackParamList } from '../types';
import { useDevice } from '../utils';
import { AuthContextProps } from '../utils/AuthProvider';

import TabNavigator from './TabNavigator';

const RootStack = createStackNavigator<RootStackParamList>();

type RootStackNavigatorProps = {
  authProps: Exclude<AuthContextProps, { isLoading: true }>;
};
export default function RootStackNavigator(props: RootStackNavigatorProps) {
  const {
    authProps: { loginRequired, token },
  } = props;
  const { navHeader, navModal, navNoShadow, shadow } = useTheme();
  const { isTablet } = useDevice();

  return (
    <RootStack.Navigator>
      <RootStack.Group
        screenOptions={{
          ...navHeader,
          presentation: 'card',
          headerBackTestID: 'HeaderBackButton',
        }}
      >
        {
          /**
           * Condition to handle private Discourse instances that require login.
           *
           * One common case for the undefined `loginRequired` is a site setting error where the API cannot be accessed because login is required.
           */

          !token && (loginRequired || loginRequired === undefined) ? (
            <>
              <RootStack.Screen
                name="Welcome"
                component={Welcome}
                options={{ title: '', ...navNoShadow }}
              />
            </>
          ) : /**
           * second condition is used for public discourse where you can access home scene but not profile scene in tab if not login
           */

          !token && !loginRequired ? (
            <>
              <RootStack.Screen
                name="TabNav"
                component={TabNavigator}
                options={{ title: '', headerShown: false }}
              />
              {/* this one require for tab in profile  */}
              <RootStack.Screen
                name="Welcome"
                component={Welcome}
                options={{ title: '', ...navNoShadow }}
              />
            </>
          ) : (
            /**
             * The last condition applies when the user is already logged in.
             * */

            token && (
              <>
                <RootStack.Screen
                  name="TabNav"
                  component={TabNavigator}
                  options={{ title: '', headerShown: false }}
                />
                <RootStack.Screen
                  name="MessageDetail"
                  component={MessageDetail}
                  options={{ title: t('Message') }}
                />
                <RootStack.Screen
                  name="ChatChannelDetail"
                  component={ChatChannelDetail}
                  options={{ title: '' }}
                />
                {!isTablet && (
                  <>
                    <RootStack.Screen
                      name="Messages"
                      component={Messages}
                      options={{ title: t('Messages') }}
                    />
                    <RootStack.Screen
                      name="AddEmail"
                      component={AddEmail}
                      options={{ title: t('New Email Address') }}
                    />
                    <RootStack.Screen
                      name="ChangePassword"
                      component={ChangePassword}
                      options={{ title: t('Change Password') }}
                    />
                    <RootStack.Screen
                      name="EditProfile"
                      component={EditProfile}
                      options={{ title: '' }}
                    />
                    <RootStack.Screen
                      name="EmailAddress"
                      component={EmailAddress}
                      options={{ title: t('Email Address') }}
                    />
                    <RootStack.Screen
                      name="EditUserStatus"
                      component={EditUSerStatus}
                      options={{ title: '' }}
                    />
                    <RootStack.Screen
                      name="Preferences"
                      component={Preferences}
                      options={{ title: t('Preferences') }}
                    />
                    <RootStack.Screen
                      name="Notifications"
                      component={Notifications}
                      options={{ title: t('Notifications') }}
                    />
                    <RootStack.Screen
                      name="Activity"
                      component={Activity}
                      options={{ title: t('Activity') }}
                    />
                  </>
                )}
              </>
            )
          )
        }

        <RootStack.Screen
          name="ImagePreview"
          component={ImagePreview}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="PostDetail"
          component={PostDetail}
          options={{ title: '' }}
        />
        <RootStack.Screen
          name="Search"
          component={Search}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="UserInformation"
          component={UserInformation}
          options={{ title: '' }}
        />
      </RootStack.Group>
      <RootStack.Group
        screenOptions={{
          ...navHeader,
          ...navModal,
          presentation: 'modal',
          headerBackTestID: 'HeaderBackButton',
        }}
      >
        {token && (
          <>
            <RootStack.Screen
              name="FlagPost"
              component={FlagPost}
              options={{ title: t('Flag'), ...navModal }}
            />
            <RootStack.Screen
              name="NewMessage"
              component={NewMessage}
              options={{ title: t('New Message'), ...navModal, ...navNoShadow }}
            />
            <RootStack.Screen
              name="NewPost"
              component={NewPost}
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
              name="PushNotificationsPreferences"
              component={PushNotifications}
              options={{ title: t('Push Notification'), ...navModal }}
            />
            <RootStack.Screen
              name="EmojiPicker"
              component={EmojiPicker}
              options={{ ...navModal }}
            />
            <RootStack.Screen
              name="DarkMode"
              component={DarkMode}
              options={{ title: t('Dark Mode'), ...navModal }}
            />
            <RootStack.Screen
              name="Tags"
              component={Tags}
              options={{ title: t('Tags'), ...navModal }}
            />
            <RootStack.Screen
              name="NewPoll"
              component={NewPoll}
              options={{ ...navModal }}
            />
            <RootStack.Screen
              name="Poll"
              component={Poll}
              options={{ ...navModal }}
            />
            <RootStack.Screen
              name="ThreadDetail"
              component={ThreadDetails}
              options={{
                ...navModal,
                title: t('Thread'),
                headerShown: true,
                ...navNoShadow,
              }}
            />
            <RootStack.Screen
              name="EditPollsList"
              component={EditPollsList}
              options={{ ...navModal }}
            />
          </>
        )}
        <RootStack.Screen
          name="Channels"
          component={Channels}
          options={{ title: t('Channels'), ...navNoShadow, ...navModal }}
          initialParams={{ prevScreen: 'Home' }}
        />
        <RootStack.Screen
          name="HyperLink"
          component={Hyperlink}
          options={{ ...navModal }}
        />
        <RootStack.Screen
          name="PostImagePreview"
          component={PostImagePreview}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Troubleshoot"
          component={Troubleshoot}
          options={{ title: t('Error Details'), headerStyle: shadow }}
        />
        <RootStack.Screen
          name="StackAvatar"
          component={StackAvatarModal}
          options={{ ...navModal }}
        />
        <RootStack.Screen
          name="AuthenticationWebView"
          component={AuthenticationWebView}
          options={{ ...navModal }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}
