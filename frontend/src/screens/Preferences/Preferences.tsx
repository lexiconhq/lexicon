import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { FIXED_COLOR_SCHEME } from '../../constants';
import MenuItem from '../Profile/components/MenuItem';
import { makeStyles } from '../../theme';
import { StackNavProp } from '../../types';
import { useDevice } from '../../utils';

export default function Preferences() {
  const styles = useStyles();

  const navigation = useNavigation<StackNavProp<'Preferences'>>();
  const { navigate } = navigation;
  const { isTablet } = useDevice();

  const hasFixedColorScheme = FIXED_COLOR_SCHEME !== 'no-preference';

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.bodyContainer}>
          <View style={[styles.menuContainer, !isTablet && styles.marginTop]}>
            {!hasFixedColorScheme && (
              <MenuItem
                title={t('Dark Mode')}
                iconName="Dark"
                onPress={() => navigate('DarkMode')}
              />
            )}
            <MenuItem
              title={t('Push Notifications')}
              iconName="NotificationActive"
              onPress={() => navigate('PushNotificationsPreferences')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bodyContainer: {
    backgroundColor: colors.backgroundDarker,
  },
  menuContainer: { backgroundColor: colors.background },
  marginTop: { marginTop: spacing.m },
}));
