import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

import { Markdown, ShowImageModal, UserStatus } from '../../components';
import { Avatar, Button, Divider, IconWithLabel, Text } from '../../core-ui';
import { getImage, useStorage } from '../../helpers';
import { useLazyProfile, useLogout, useSiteSettings } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { StackNavProp, UserDetail } from '../../types';
import { useAuth } from '../../utils/AuthProvider';

import MenuItem from './components/MenuItem';

export default function Profile() {
  const styles = useStyles();
  const { colors } = useTheme();

  const navigation = useNavigation<StackNavProp<'Profile'>>();
  const { navigate } = navigation;

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

  const { allowUserStatus } = useSiteSettings({
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProfile();
    });

    return unsubscribe;
  }, [navigation, getProfile]);

  const { logout, loading: logoutLoading } = useLogout();

  const userImage = getImage(data?.userProfile.user.avatar || '', 'xl');
  const useAuthResults = useAuth();

  const onLogout = async () => {
    try {
      await useAuthResults.cleanSession();
    } catch (error) {
      /**
       * This catch error requires further discussion regarding what we want to display when there's an error during the `cleanSession` process.
       * */
    }

    logout({ username });
  };

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line no-underscore-dangle
      data.userProfile.user.__typename === 'UserDetail' &&
        setUser(data.userProfile.user);
      setSplittedBio(data.userProfile.user.bioRaw?.split(/\r\n|\r|\n/));
      setHaveNotification(data?.userProfile.unreadNotification);
    }
  }, [data, setUser]);

  const onPressCancel = () => {
    setShow(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <ScrollView>
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
                  onPress={() => {
                    navigate('EditUserStatus', {});
                  }}
                />
              ) : (
                <UserStatus
                  emojiCode={user.status.emoji}
                  status={user.status.description}
                  showEditIcon
                  onPress={() => {
                    navigate('EditUserStatus', {
                      emojiCode: user.status?.emoji,
                      status: user.status?.description,
                      endDate: user.status?.endsAt || '',
                    });
                  }}
                />
              ))}
            <Button
              content={t('Edit Profile')}
              style={styles.button}
              disabled={!data}
              onPress={() => navigate('EditProfile', { user })}
            />
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.menuContainer}>
              <MenuItem
                title={t('Notifications')}
                iconName="Notifications"
                indicator={haveNotification}
                onPress={() => navigate('Notifications')}
              />
              <Divider style={styles.dividerList} />
              <MenuItem
                title={t('Messages')}
                iconName="Mail"
                onPress={() => navigate('Messages')}
              />
              <Divider style={styles.dividerList} />
              <MenuItem
                title={t('Activity')}
                iconName="Chart"
                onPress={() => navigate('Activity')}
              />
            </View>
            <View style={styles.menuContainer}>
              <MenuItem
                title={t('Password & Security')}
                iconName="Lock"
                onPress={() => navigate('ChangePassword')}
              />
              <Divider style={styles.dividerList} />
              <MenuItem
                title={t('Linked Accounts')}
                iconName="Admin"
                onPress={() => navigate('EmailAddress')}
              />
              <Divider style={styles.dividerList} />
              <MenuItem
                title={t('Preferences')}
                iconName="Settings"
                onPress={() => navigate('Preferences')}
              />
            </View>
            <View style={styles.menuContainer}>
              <MenuItem
                title={t('Log Out')}
                iconName="Power"
                iconColor={colors.error}
                onPress={onLogout}
                loading={logoutLoading}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.bounceContainer}>
          <View style={styles.topBounce} />
          <View style={styles.bottomBounce} />
        </View>
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
  container: {
    flex: 1,
    position: 'relative',
    marginTop: 10,
  },
  statusBar: {
    paddingTop: Constants.statusBarHeight,
    paddingBottom: spacing.m,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  usernameText: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.s,
  },
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
  bodyContainer: {
    backgroundColor: colors.backgroundDarker,
  },
  menuContainer: {
    backgroundColor: colors.background,
    marginTop: spacing.m,
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
}));
