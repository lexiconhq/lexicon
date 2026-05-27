import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React, { useState } from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';

import { Markdown, UserStatus } from '../components';
import {
  DISCORD_INVITE_URL,
  FIXED_COLOR_SCHEME,
  TELEGRAM_COMMUNITY_URL,
} from '../constants';
import { SIDE_BAR_WIDTH } from '../constants/layout';
import { Avatar, Divider, IconWithLabel, Text } from '../core-ui';
import { getImage, navigateInProfile, useStorage } from '../helpers';
import { useLogout, useProfile, useSiteSettings } from '../hooks';
import { IconName } from '../icons';
import {
  Activity,
  AddEmail,
  AdditionalResourceDetail,
  AdditionalResources,
  BlockedUsers,
  HiddenWords,
  ChangePassword,
  EditProfile,
  EditUSerStatus,
  EmailAddress,
  Messages,
  Notifications,
} from '../screens';
import { navigate } from './NavigationService';
import { makeStyles, useTheme } from '../theme';
import { RootStackParamList, UserDetail } from '../types';
import { useAuth } from '../utils/AuthProvider';

const ProfileDrawer = createDrawerNavigator<RootStackParamList>();

type DrawerItemProps = {
  label: string;
  icon: IconName;
  onPress: () => void;
  active?: boolean;
};

function DrawerItem(props: DrawerItemProps) {
  const { label, icon, onPress, active = false } = props;
  const styles = useStyles();
  const { colors } = useTheme();
  const isIOS = Platform.OS === 'ios';

  return (
    <TouchableOpacity
      style={[
        styles.drawerItemContainer,
        isIOS ? styles.drawerItemIOS : styles.drawerItemAndroid,
        active &&
          (isIOS ? styles.activeBackgroundIOS : styles.activeBackgroundAndroid),
      ]}
      onPress={onPress}
    >
      <IconWithLabel
        label={label}
        icon={icon}
        fontStyle={[
          styles.label,
          active && (isIOS ? styles.activeLabelIOS : styles.activeLabelAndroid),
        ]}
        color={
          active
            ? isIOS
              ? colors.pureWhite
              : colors.activeTab
            : colors.lightTextDarkest
        }
      />
    </TouchableOpacity>
  );
}

function DrawerContent({ state }: DrawerContentComponentProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

  const useAuthResults = useAuth();

  const [user, setUser] = useState<UserDetail>({
    __typename: 'UserDetail',
    avatar: '',
    bioRaw: '',
    dateOfBirth: '',
    location: '',
    name: '',
    username: '',
    websiteName: '',
    email: '',
    secondaryEmails: [],
    unconfirmedEmails: [],
    canEditUsername: true,
    admin: true,
    status: {
      emoji: '',
      description: '',
      endsAt: '',
    },
  });
  const [splittedBio, setSplittedBio] = useState<Array<string>>();

  const hasFixedColorScheme = FIXED_COLOR_SCHEME !== 'no-preference';

  const { allowUserStatus, enableLexiconPushNotifications } = useSiteSettings({
    fetchPolicy: 'network-only',
  });

  const { data } = useProfile(
    {
      variables: { username },
      onCompleted: ({ profile }) => {
        // eslint-disable-next-line no-underscore-dangle
        if (profile.user.__typename === 'UserDetail') {
          setUser(profile.user);
          setSplittedBio(profile.user.bioRaw?.split(/\r\n|\r|\n/));
        }
      },
    },
    'HIDE_ALERT',
  );

  const { logout } = useLogout({
    onCompleted: async () => {
      await useAuthResults.cleanSession();
    },
  });

  const userImage = getImage(data?.profile.user.avatar || '', 'xl');

  const onLogout = async () => {
    logout({
      enableLexiconPushNotifications: enableLexiconPushNotifications || false,
    });
  };

  const isActive = (route: string) => {
    const routeIndex = state.routeNames.findIndex(
      (routeName) => routeName === route,
    );
    return (
      state.index === routeIndex ||
      (route === 'EmailAddress' && state.index === 5)
    );
  };

  return (
    <View style={styles.drawerRoot}>
      <DrawerContentScrollView
        style={styles.drawerScroll}
        contentContainerStyle={styles.drawerScrollContent}
      >
      <View style={styles.headerContainer}>
        <Avatar src={userImage} size="l" label={username[0]} />
        <Text variant="semiBold" size="l" style={styles.usernameText}>
          {username}
        </Text>
        <Text
          variant="normal"
          size="m"
          color="lightTextDarker"
          style={styles.email}
        >
          {user.email}
        </Text>
        <Markdown
          content={
            (splittedBio && splittedBio.length > 3
              ? `${splittedBio.slice(0, 3).join('\n')}...`
              : user.bioRaw) || ''
          }
          style={styles.bioContainer}
        />
        {allowUserStatus &&
          (!user.status?.description && !user.status?.emoji ? (
            <IconWithLabel
              label={t('Set Status')}
              icon="Edit"
              fontStyle={styles.setStatusText}
              color={colors.textLighter}
              onPress={() => {
                navigateInProfile('EditUserStatus', {});
              }}
              testID="Profile:IconWithLabel"
            />
          ) : (
            <UserStatus
              emojiCode={user.status.emoji}
              status={user.status.description}
              showEditIcon
              onPress={() => {
                navigateInProfile('EditUserStatus', {
                  emojiCode: user.status?.emoji,
                  status: user.status?.description,
                  endDate: user.status?.endsAt || '',
                });
              }}
              testID="Profile:UserStatus"
            />
          ))}
      </View>
      <Divider />
      <View style={styles.menuContainer}>
        <DrawerItem
          label={t('Edit Profile')}
          icon="Edit"
          onPress={() => navigateInProfile('EditProfile', { user })}
          active={isActive('EditProfile')}
        />
      </View>
      <Divider />
      <View style={styles.menuContainer}>
        <DrawerItem
          label={t('Messages')}
          icon="Mail"
          onPress={() => navigateInProfile('Messages', undefined)}
          active={isActive('Messages')}
        />
        <DrawerItem
          label={t('Activity')}
          icon="Chart"
          onPress={() => navigateInProfile('Activity', undefined)}
          active={isActive('Activity')}
        />
      </View>
      <Divider />
      <View style={styles.menuContainer}>
        <DrawerItem
          label={t('Password & Security')}
          icon="Lock"
          onPress={() => navigateInProfile('ChangePassword', undefined)}
          active={isActive('ChangePassword')}
        />
        <DrawerItem
          label={t('Linked Accounts')}
          icon="Admin"
          onPress={() => navigateInProfile('EmailAddress', undefined)}
          active={isActive('EmailAddress')}
        />
      </View>
      <Divider />
      <View style={styles.menuContainer}>
        <DrawerItem
          label={t('Notifications')}
          icon="Notifications"
          onPress={() => navigateInProfile('Notifications', undefined)}
          active={isActive('Notifications')}
        />
        {!hasFixedColorScheme ? (
          <DrawerItem
            label={t('Dark Mode')}
            icon="Dark"
            onPress={() => navigate('DarkMode')}
          />
        ) : null}
        <DrawerItem
          label={t('Push Notifications')}
          icon="NotificationActive"
          onPress={() => navigate('PushNotificationsPreferences')}
        />
        <DrawerItem
          label={t('Blocked users')}
          icon="RemoveCircle"
          onPress={() => navigateInProfile('BlockedUsers', undefined)}
          active={isActive('BlockedUsers')}
        />
        <DrawerItem
          label={t('Additional Resources')}
          icon="Information"
          onPress={() => navigateInProfile('AdditionalResources', undefined)}
          active={isActive('AdditionalResources')}
        />
        <DrawerItem
          label={t('Discord')}
          icon="Discord"
          onPress={() => Linking.openURL(DISCORD_INVITE_URL)}
        />
        <DrawerItem
          label={t('Telegram')}
          icon="Telegram"
          onPress={() => Linking.openURL(TELEGRAM_COMMUNITY_URL)}
        />
      </View>
      <Divider />
      <View style={styles.menuContainer}>
        <DrawerItem label={t('Log Out')} icon="Power" onPress={onLogout} />
      </View>
      </DrawerContentScrollView>
    </View>
  );
}

export default function ProfileDrawerNavigator() {
  const { navHeader, colors } = useTheme();
  return (
    <ProfileDrawer.Navigator
      initialRouteName="Notifications"
      defaultStatus="open"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerType: 'permanent',
        ...navHeader,
        drawerStyle: {
          width: SIDE_BAR_WIDTH,
          borderRightWidth: 1,
          borderRightColor: colors.border,
        },
        drawerContentContainerStyle: { paddingTop: 0 },
        sceneContainerStyle: {
          backgroundColor: colors.background,
          flex: 1,
        },
        safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
      }}
    >
      <ProfileDrawer.Screen
        name="Notifications"
        component={Notifications}
        options={{ title: t('Notifications'), headerLeft: () => undefined }}
      />
      <ProfileDrawer.Screen
        name="Messages"
        component={Messages}
        options={{ title: t('Messages'), headerLeft: () => undefined }}
      />
      <ProfileDrawer.Screen
        name="Activity"
        component={Activity}
        options={{ title: t('Activity'), headerLeft: () => undefined }}
      />
      <ProfileDrawer.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: t('Change Password'), headerLeft: () => undefined }}
      />
      <ProfileDrawer.Screen
        name="EmailAddress"
        component={EmailAddress}
        options={{ title: t('Email Address'), headerLeft: () => undefined }}
      />
      <ProfileDrawer.Screen
        name="AddEmail"
        component={AddEmail}
        options={{ title: t('New Email Address') }}
      />
      <ProfileDrawer.Screen
        name="BlockedUsers"
        component={BlockedUsers}
        options={{ title: t('Blocked Users'), headerLeft: () => undefined }}
      />
      <ProfileDrawer.Screen
        name="HiddenWords"
        component={HiddenWords}
        options={{ title: t('Hidden Words'), headerLeft: () => undefined }}
      />
      <ProfileDrawer.Screen
        name="AdditionalResources"
        component={AdditionalResources}
        options={{
          title: t('Additional Resources'),
          headerLeft: () => undefined,
        }}
      />
      <ProfileDrawer.Screen
        name="AdditionalResourceDetail"
        component={AdditionalResourceDetail}
        options={{ title: '', headerLeft: () => undefined }}
      />
      <ProfileDrawer.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: t('Edit Profile'), headerLeft: () => undefined }}
      />
      <ProfileDrawer.Screen
        name="EditUserStatus"
        component={EditUSerStatus}
        options={{ title: '', headerLeft: () => undefined }}
      />
    </ProfileDrawer.Navigator>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  drawerRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerScrollContent: {
    flexGrow: 1,
  },
  drawerItemContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerItemIOS: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: 12,
  },
  drawerItemAndroid: {
    padding: spacing.xl,
    borderRadius: 100,
  },
  label: { paddingLeft: spacing.xl, color: colors.lightTextDarker },
  activeLabelIOS: { color: colors.pureWhite },
  activeLabelAndroid: { color: colors.activeTab },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingBottom: spacing.xl,
  },
  menuContainer: { paddingHorizontal: spacing.xl, paddingVertical: spacing.l },
  usernameText: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.s,
  },
  email: {
    paddingBottom: spacing.l,
    textAlign: 'center',
    paddingHorizontal: spacing.l,
  },
  bioContainer: { paddingHorizontal: spacing.xxl },
  setStatusText: {
    color: colors.lightTextDarker,
    flexGrow: 0,
    paddingLeft: spacing.s,
  },
  activeBackgroundIOS: { backgroundColor: colors.activeTab },
  activeBackgroundAndroid: {
    backgroundColor: colors.activeTab + '1A',
  },
}));
