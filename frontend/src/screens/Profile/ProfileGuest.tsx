import Constants from 'expo-constants';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomHeader } from '../../components';
import { Button, Text } from '../../core-ui';
import { makeStyles } from '../../theme';
import { navigate } from '../../navigation/NavigationService';
import { useBlockedUsers, useHiddenWords } from '../../utils';

import ProfileCommunityMenu from './components/ProfileCommunityMenu';

export default function ProfileGuest() {
  const styles = useStyles();
  const { bottom: safeBottom } = useSafeAreaInsets();
  const { blockedUsernamesList } = useBlockedUsers();
  const { hiddenWordsList } = useHiddenWords();

  const blockedCount = blockedUsernamesList.length;
  const hiddenWordsCount = hiddenWordsList.length;

  return (
    <>
      <CustomHeader title={t('Profile')} />
      <View style={styles.container}>
        <View style={styles.topInset} />

        <View style={styles.menuContainer}>
          <ProfileCommunityMenu
            blockedCount={blockedCount}
            hiddenWordsCount={hiddenWordsCount}
            menuItemStyle={styles.menuItem}
          />
        </View>

        <View style={styles.flexSpacer} />

        <View
          style={[
            styles.signInCard,
            safeBottom > 0 && { paddingBottom: safeBottom },
          ]}
        >
          <Text variant="semiBold" size="l" style={styles.title}>
            {t('Sign in to your account')}
          </Text>
          <Text color="textLight" style={styles.subtitle}>
            {t(
              'Log in or create an account to access messages, notifications, and forum preferences.',
            )}
          </Text>
          <Button
            content={t('Get Started')}
            large
            onPress={() => navigate('Welcome')}
            style={styles.getStarted}
          />
        </View>
      </View>
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  topInset: {
    flexShrink: 0,
    paddingTop: Constants.statusBarHeight,
    paddingBottom: spacing.m,
  },
  flexSpacer: {
    flex: 1,
    flexShrink: 1,
  },
  menuContainer: {
    flexShrink: 0,
    backgroundColor: colors.background,
    marginTop: spacing.m,
  },
  menuItem: {
    flex: 0,
  },
  signInCard: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  getStarted: {
    minWidth: 200,
  },
}));
