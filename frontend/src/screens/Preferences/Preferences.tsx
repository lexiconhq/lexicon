import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { FIXED_COLOR_SCHEME } from '../../constants';
import MenuItem from '../Profile/components/MenuItem';
import { makeStyles } from '../../theme';
import { StackNavProp } from '../../types';

export default function Preferences() {
  const styles = useStyles();

  const navigation = useNavigation<StackNavProp<'Profile'>>();
  const { navigate } = navigation;

  const hasFixedColorScheme = FIXED_COLOR_SCHEME !== 'no-preference';

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.bodyContainer}>
          <View style={styles.menuContainer}>
            {!hasFixedColorScheme && (
              <MenuItem
                title={t('Dark Mode')}
                iconName="Dark"
                onPress={() => navigate('DarkMode')}
              />
            )}
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
