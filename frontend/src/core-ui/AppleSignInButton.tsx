import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';

import { makeStyles } from '../theme';

import { ActivityIndicator } from './ActivityIndicator';

type Props = {
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function AppleSignInButton(props: Props) {
  const { loading, onPress, disabled } = props;
  const styles = useStyles();

  return loading ? (
    <ActivityIndicator />
  ) : (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={
        AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
      }
      cornerRadius={20}
      style={styles.appleLoginButton}
      onPress={!disabled ? onPress : () => {}}
    />
  );
}

const useStyles = makeStyles(() => ({
  appleLoginButton: { width: '100%', height: 44 },
}));
