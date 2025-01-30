import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { CustomHeader, HeaderItem, ModalHeader } from '../../components';
import { makeStyles } from '../../theme';
import { StackNavProp } from '../../types';
import { usePushNotificationsContext } from '../../utils';

import SettingsSwitch from './components/SettingsSwitch';

export default function PushNotifications() {
  const { pushNotificationsPreferences, setPnPreferences } =
    usePushNotificationsContext();

  const styles = useStyles();

  const { goBack } = useNavigation<StackNavProp<'Preferences'>>();

  const { shouldShowAlert, shouldPlaySound, shouldSetBadge } =
    pushNotificationsPreferences;

  const toggleShowAlert = (active: boolean) => {
    setPnPreferences({ key: 'shouldShowAlert', active });
  };
  const togglePlaySound = (active: boolean) => {
    setPnPreferences({ key: 'shouldPlaySound', active });
  };
  const toggleSetBadge = (active: boolean) => {
    setPnPreferences({ key: 'shouldSetBadge', active });
  };

  const ios = Platform.OS === 'ios';

  const Header = () =>
    ios ? (
      <ModalHeader
        title={t('Push Notifications')}
        left={<HeaderItem label={t('Back')} left onPressItem={goBack} />}
      />
    ) : (
      <CustomHeader title={t('Push Notifications')} />
    );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.bodyContainer}>
          <View style={styles.menuContainer}>
            <SettingsSwitch
              title={'Show Alert'}
              isEnabled={shouldShowAlert}
              onSwitch={toggleShowAlert}
            />
            <SettingsSwitch
              title={'Play Sound'}
              isEnabled={shouldPlaySound}
              onSwitch={togglePlaySound}
            />
            <SettingsSwitch
              title={'Set Badge'}
              isEnabled={shouldSetBadge}
              onSwitch={toggleSetBadge}
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
  menuContainer: {
    backgroundColor: colors.background,
    marginTop: spacing.m,
  },
}));
