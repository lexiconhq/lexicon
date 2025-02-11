import React, { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { CustomHeader, HeaderItem, ModalHeader } from '../../components';
import { ColorScheme, useStorage } from '../../helpers';
import { makeStyles, useColorScheme } from '../../theme';
import { StackNavProp } from '../../types';

import SettingsItem from './components/SettingsItem';

export default function DarkMode() {
  const { setColorScheme } = useColorScheme();
  const styles = useStyles();

  const { goBack } = useNavigation<StackNavProp<'Preferences'>>();

  const storage = useStorage();
  const [cachedColorScheme, setCachedColorScheme] = useState(
    storage.getItem('colorScheme'),
  );

  const ios = Platform.OS === 'ios';

  const Header = () =>
    ios ? (
      <ModalHeader
        title={t('Dark Mode')}
        left={<HeaderItem label={t('Back')} left onPressItem={goBack} />}
      />
    ) : (
      <CustomHeader title={t('Dark Mode')} />
    );

  const changeColorScheme = (colorScheme: ColorScheme) => {
    setColorScheme(colorScheme);
    setCachedColorScheme(colorScheme);
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.bodyContainer}>
          <View style={styles.menuContainer}>
            <SettingsItem
              title={t('On')}
              onPress={() => changeColorScheme('dark')}
              selected={cachedColorScheme === 'dark'}
            />
            <SettingsItem
              title={t('Off')}
              onPress={() => changeColorScheme('light')}
              selected={cachedColorScheme === 'light'}
            />
            <SettingsItem
              title={t('System')}
              onPress={() => changeColorScheme('no-preference')}
              selected={cachedColorScheme === 'no-preference'}
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
