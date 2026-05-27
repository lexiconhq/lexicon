import React, { useCallback } from 'react';
import { Linking, View, ViewStyle } from 'react-native';

import {
  DISCORD_INVITE_URL,
  FIXED_COLOR_SCHEME,
  TELEGRAM_COMMUNITY_URL,
} from '../../../constants';
import { Divider, Text } from '../../../core-ui';
import { navigateInProfile } from '../../../helpers';
import { navigate } from '../../../navigation/NavigationService';
import { makeStyles } from '../../../theme';

import MenuItem from './MenuItem';

type Props = {
  showNotifications?: boolean;
  haveNotification?: boolean;
  blockedCount?: number;
  hiddenWordsCount?: number;
  menuItemStyle?: ViewStyle;
};

export default function ProfileCommunityMenu(props: Props) {
  const {
    showNotifications = false,
    haveNotification = false,
    blockedCount = 0,
    hiddenWordsCount = 0,
    menuItemStyle,
  } = props;
  const styles = useStyles();

  const hasFixedColorScheme = FIXED_COLOR_SCHEME !== 'no-preference';

  const openDiscord = useCallback(() => {
    Linking.openURL(DISCORD_INVITE_URL);
  }, []);

  const openTelegram = useCallback(() => {
    Linking.openURL(TELEGRAM_COMMUNITY_URL);
  }, []);

  return (
    <View style={styles.menuContainer}>
      {showNotifications ? (
        <>
          <MenuItem
            title={t('Notifications')}
            iconName="Notifications"
            indicator={haveNotification}
            onPress={() => navigateInProfile('Notifications', undefined)}
            style={menuItemStyle}
          />
          <Divider style={styles.dividerList} />
        </>
      ) : null}
      {!hasFixedColorScheme ? (
        <>
          <MenuItem
            title={t('Dark Mode')}
            iconName="Dark"
            onPress={() => navigate('DarkMode')}
            style={menuItemStyle}
          />
          <Divider style={styles.dividerList} />
        </>
      ) : null}
      <MenuItem
        title={t('Push Notifications')}
        iconName="NotificationActive"
        onPress={() => navigate('PushNotificationsPreferences')}
        style={menuItemStyle}
      />
      <Divider style={styles.dividerList} />
      <MenuItem
        title={t('Blocked Users')}
        iconName="RemoveCircle"
        onPress={() => navigate('BlockedUsers')}
        style={menuItemStyle}
      />
      {blockedCount > 0 ? (
        <Text style={styles.hint} color="textLight">
          {t('{count} blocked', { count: blockedCount })}
        </Text>
      ) : null}
      <Divider style={styles.dividerList} />
      <MenuItem
        title={t('Hidden Words')}
        iconName="KeyboardHide"
        onPress={() => navigate('HiddenWords')}
        style={menuItemStyle}
      />
      {hiddenWordsCount > 0 ? (
        <Text style={styles.hint} color="textLight">
          {t('{count} hidden words', { count: hiddenWordsCount })}
        </Text>
      ) : null}
      <Divider style={styles.dividerList} />
      <MenuItem
        title={t('Additional Resources')}
        iconName="Information"
        onPress={() => navigate('AdditionalResources')}
        style={menuItemStyle}
      />
      <Divider style={styles.dividerList} />
      <MenuItem
        title={t('Discord')}
        iconName="Discord"
        onPress={openDiscord}
        style={menuItemStyle}
      />
      <Divider style={styles.dividerList} />
      <MenuItem
        title={t('Telegram')}
        iconName="Telegram"
        onPress={openTelegram}
        style={menuItemStyle}
      />
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  menuContainer: {
    flexShrink: 0,
    backgroundColor: 'transparent',
  },
  dividerList: {
    flexGrow: 0,
    marginLeft: 64,
    marginRight: spacing.xxl,
  },
  hint: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.l,
    fontSize: 14,
  },
}));
