import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, View, Text as RNText } from 'react-native';

import { DarkLogo, LightLogo } from '../../assets/images';
import { Button, Text } from '../core-ui';
import { makeStyles, useColorScheme } from '../theme';
import { StackNavProp } from '../types';

export default function Welcome() {
  const { colorScheme } = useColorScheme();
  const styles = useStyles();

  const { navigate } = useNavigation<StackNavProp<'Welcome'>>();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={colorScheme === 'dark' ? DarkLogo : LightLogo}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.textCenter}>
          {t('Login or register first to access all of the exciting features.')}
        </Text>
      </View>
      <Button
        content={t('Get Started')}
        large
        onPress={() => navigate('AuthenticationWebView')}
      />
      <View style={styles.disclaimerContainer}>
        <RNText style={styles.disclaimerStyle}>
          {t('By clicking this button, you agree to the ')}
          <RNText style={styles.inlineColor}>{t('privacy policy ')}</RNText>
          {t('and ')}
          <RNText style={styles.inlineColor}>{t('terms of service')}</RNText>
        </RNText>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing, fontSizes }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  logoContainer: { flexGrow: 1, justifyContent: 'center' },
  logo: {
    height: 120,
    width: '100%',
    marginVertical: spacing.xxxl,
    backgroundColor: colors.background,
  },
  textCenter: { textAlign: 'center' },
  disclaimerContainer: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  disclaimerStyle: {
    color: colors.textLight,
    fontSize: fontSizes.s,
    textAlign: 'center',
  },
  inlineColor: { color: colors.primary },
}));
