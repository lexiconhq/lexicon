import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  CustomHeader,
  LoadingOrError,
  Markdown,
  ShowImageModal,
  UserStatus,
} from '../../components';
import { currentScreenVar } from '../../constants';
import { Avatar, Button, Divider, IconWithLabel, Text } from '../../core-ui';
import { getImage, navigateInProfile, useStorage } from '../../helpers';
import { useLazyProfile, useLogout, useSiteSettings } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { StackNavProp, UserDetail } from '../../types';
import { useDevice } from '../../utils';
import { useAuth } from '../../utils/AuthProvider';

import MenuItem from './components/MenuItem';

export default function Profile() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { isTablet } = useDevice();

  const navigation = useNavigation<StackNavProp<'ProfileScreen'>>();

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

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

  const [haveNotification, setHaveNotification] = useState(false);
  const [show, setShow] = useState(false);
  const [splittedBio, setSplittedBio] = useState<Array<string>>();

  const { getProfile, data } = useLazyProfile(
    {
      variables: { username },
    },
    'HIDE_ALERT',
  );

  const { allowUserStatus, enableLexiconPushNotifications } = useSiteSettings({
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    // NOTE: We use the 'state' listener for tablets because,
    // in tablet view, changing screen orientation doesn't trigger the 'focus' event,
    // which results in the profile data not getting re-fetched. Meanwhile, with the 'state' event,
    // because we use different navigators for portrait (Stack Navigator) and
    // landscape (Drawer Navigator) modes, it gets triggered when changing screen orientation.
    // We added a condition to only fetch the profile data when it is currently on the Profile screen.
    // We do not use 'state' for phones because of the different navigation structure.
    // On tablets, the Profile screen is inside a Stack Navigator using 'ProfileScreen',
    // whereas on phones, it is inside a Tab Navigator using the name 'Profile'.

    let unsubscribe;
    if (isTablet) {
      unsubscribe = navigation.addListener('state', ({ data }) => {
        const latestScreen = data.state.routes.slice(-1).pop();
        if (latestScreen?.name === 'ProfileScreen') {
          currentScreenVar({
            screen: 'ProfileScreen',
            params: undefined,
          });
          getProfile();
        }
      });
    } else {
      unsubscribe = navigation.addListener('focus', () => {
        getProfile();
      });
    }

    return unsubscribe;
  }, [navigation, getProfile, isTablet]);

  const { logout, loading: logoutLoading } = useLogout({
    onCompleted: async () => {
      // Require to move clean token session after logout because we still use token user api key when call logout api

      await useAuthResults.cleanSession();
    },
  });

  const userImage = getImage(data?.profile.user.avatar || '', 'xl');
  const useAuthResults = useAuth();

  const onLogout = async () => {
    logout({
      enableLexiconPushNotifications: enableLexiconPushNotifications || false,
    });
  };

  useEffect(() => {
    if (data) {
      data.profile.user && setUser(data.profile.user);
      setSplittedBio(data.profile.user.bioRaw?.split(/\r\n|\r|\n/));
      setHaveNotification(
        data?.profile.unreadNotification.isThereUnreadNotifications,
      );
    }
  }, [data, setUser]);

  const onPressCancel = () => {
    setShow(false);
  };

  if (logoutLoading) {
    return <LoadingOrError loading style={styles.loadingContainer} />;
  }

  return (
    <>
      <CustomHeader title={t('Profile')} />
      <View style={[styles.container, !isTablet && styles.flex]}>
        {!isTablet && <View style={styles.statusBar} />}

        <ScrollView
          testID="Profile:ScrollView"
          style={isTablet && styles.tabletScroll}
        >
          {isTablet ? (
            <View style={styles.tabletHeaderContainer}>
              <View style={[styles.tabletHeaderItemContainer, styles.flex]}>
                <Avatar
                  src={userImage}
                  size="l"
                  label={username[0]}
                  onPress={() => {
                    setShow(true);
                  }}
                />
                <View style={styles.tabletUserInfo}>
                  <Text
                    variant="semiBold"
                    size="xl"
                    style={styles.tabletUserameText}
                  >
                    {username}
                  </Text>
                  <Text
                    variant="normal"
                    size="m"
                    color="lightTextDarker"
                    numberOfLines={1}
                  >
                    {user.email}
                  </Text>
                  {allowUserStatus &&
                    (!user.status?.description && !user.status?.emoji ? (
                      <IconWithLabel
                        label={t('Set Status')}
                        icon="Edit"
                        fontStyle={styles.setStatusText}
                        color={colors.textLighter}
                        onPress={() => navigateInProfile('EditUserStatus', {})}
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
              </View>
              <View
                style={[styles.tabletHeaderItemContainer, styles.marginLeft]}
              >
                <Button
                  content={t('Edit Profile')}
                  disabled={!data}
                  onPress={() => navigateInProfile('EditProfile', { user })}
                  testID="Profile:Button:EditProfile"
                />
              </View>
            </View>
          ) : (
            <View style={styles.headerContainer}>
              <Avatar
                src={userImage}
                size="l"
                label={username[0]}
                onPress={() => {
                  setShow(true);
                }}
              />
              <View style={styles.usernameText}>
                <Text variant="semiBold" size="l">
                  {username}
                </Text>
              </View>
              <View style={styles.email}>
                <Text variant="normal" size="m" color="lightTextDarker">
                  {user.email}
                </Text>
              </View>
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
                    onPress={() => navigateInProfile('EditUserStatus', {})}
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
              <Button
                content={t('Edit Profile')}
                style={styles.button}
                disabled={!data}
                onPress={() => navigateInProfile('EditProfile', { user })}
                testID="Profile:Button:EditProfile"
              />
            </View>
          )}
          <View style={!isTablet && styles.bodyContainer}>
            <View
              style={
                isTablet ? styles.tabletMenuContainer : styles.menuContainer
              }
            >
              <MenuItem
                title={t('Notifications')}
                iconName="Notifications"
                indicator={haveNotification}
                onPress={() => navigateInProfile('Notifications', undefined)}
              />
              <Divider style={styles.dividerList} />
              <MenuItem
                title={t('Messages')}
                iconName="Mail"
                onPress={() => navigateInProfile('Messages', undefined)}
                testID="Profile:MenuItem:Messages"
              />
              <Divider style={styles.dividerList} />
              <MenuItem
                title={t('Activity')}
                iconName="Chart"
                onPress={() => navigateInProfile('Activity', undefined)}
              />
            </View>
            <View
              style={
                isTablet ? styles.tabletMenuContainer : styles.menuContainer
              }
            >
              <MenuItem
                title={t('Password & Security')}
                iconName="Lock"
                onPress={() => navigateInProfile('ChangePassword', undefined)}
              />
              <Divider style={styles.dividerList} />
              <MenuItem
                title={t('Linked Accounts')}
                iconName="Admin"
                onPress={() => navigateInProfile('EmailAddress', undefined)}
              />
              <Divider style={styles.dividerList} />
              <MenuItem
                title={t('Preferences')}
                iconName="Settings"
                onPress={() => navigateInProfile('Preferences', undefined)}
              />
            </View>
            <View
              style={
                isTablet ? styles.tabletMenuContainer : styles.menuContainer
              }
            >
              <MenuItem
                title={t('Log Out')}
                iconName="Power"
                iconColor={colors.error}
                onPress={onLogout}
                loading={logoutLoading}
                testID="Profile:MenuItem:Logout"
              />
            </View>
          </View>
        </ScrollView>

        {!isTablet && (
          <View style={styles.bounceContainer}>
            <View style={styles.topBounce} />
            <View style={styles.bottomBounce} />
          </View>
        )}
      </View>
      <ShowImageModal
        show={show}
        userImage={{ uri: userImage }}
        onPressCancel={onPressCancel}
      />
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    backgroundColor: colors.backgroundDarker,
  },
  tabletScroll: {
    paddingHorizontal: spacing.xxxxxl,
    paddingTop: spacing.xl + spacing.s,
  },
  statusBar: {
    paddingTop: Constants.statusBarHeight,
    paddingBottom: spacing.m,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  tabletHeaderContainer: {
    paddingVertical: spacing.xl + spacing.s,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  tabletHeaderItemContainer: { flexDirection: 'row', alignItems: 'center' },
  tabletUserInfo: { marginLeft: spacing.xl, justifyContent: 'center', flex: 1 },
  usernameText: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.s,
  },
  tabletUserameText: { marginBottom: spacing.xs },
  email: {
    paddingBottom: spacing.m,
  },
  bioContainer: {
    paddingHorizontal: spacing.xxl,
  },
  setStatusText: {
    color: colors.lightTextDarker,
    flexGrow: 0,
    paddingLeft: spacing.s,
  },
  button: {
    marginTop: spacing.l,
    marginBottom: spacing.xxl,
  },
  bodyContainer: { backgroundColor: colors.backgroundDarker },
  menuContainer: {
    backgroundColor: colors.background,
    marginTop: spacing.m,
  },
  tabletMenuContainer: {
    backgroundColor: colors.background,
    marginTop: spacing.l,
    borderRadius: 12,
  },
  dividerList: {
    flexGrow: 0,
    marginLeft: 64,
    marginRight: spacing.xxl,
  },
  bounceContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  topBounce: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomBounce: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  marginLeft: { marginLeft: spacing.l },

  loadingContainer: {
    backgroundColor: colors.background,
  },
}));
