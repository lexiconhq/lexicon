import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import { Image, Text as RNText, View } from 'react-native';

import { EULA_URL } from '../constants';
import { Button, RadioButton, Text } from '../core-ui';
import { makeStyles } from '../theme';
import { StackNavProp } from '../types';

const WELCOME_ICON = require('../../assets/icon.png');

export default function Welcome() {
  const styles = useStyles();
  const [eulaAccepted, setEulaAccepted] = useState(false);

  const { navigate } = useNavigation<StackNavProp<'Welcome'>>();

  const openEula = () => {
    Linking.openURL(EULA_URL);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={WELCOME_ICON}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel={t('Biohacking Forum')}
        />
        <Text style={styles.textCenter}>
          {t('Login or register first to access all of the exciting features.')}
        </Text>
      </View>

      <RadioButton
        selected={eulaAccepted}
        onPress={() => setEulaAccepted((accepted) => !accepted)}
        checkCircleIcon
        style={styles.eulaRow}
      >
        <RNText style={styles.eulaText}>
          {t('I agree to the ')}
          <RNText style={styles.linkText} onPress={openEula}>
            {t('Community Guidelines and EULA')}
          </RNText>
          {t(
            ', which include zero tolerance for inappropriate content and abusive behavior. Users who violate these rules may be removed.',
          )}
        </RNText>
      </RadioButton>

      <Button
        content={t('Get Started')}
        large
        disabled={!eulaAccepted}
        onPress={() => {
          if (!eulaAccepted) {
            return;
          }
          navigate('AuthenticationWebView', { eulaAccepted: true });
        }}
      />
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
    width: 220,
    height: 220,
    maxWidth: '80%',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  textCenter: { textAlign: 'center' },
  eulaRow: {
    paddingVertical: spacing.m,
    marginBottom: spacing.l,
  },
  eulaText: {
    color: colors.textNormal,
    fontSize: fontSizes.s,
    lineHeight: fontSizes.s * 1.5,
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
}));
