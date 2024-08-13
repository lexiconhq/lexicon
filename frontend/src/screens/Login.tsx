import React, { useEffect, useRef, useState } from 'react';
import { Image, Keyboard, View, Platform, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import * as AppleAuthentication from 'expo-apple-authentication';

import { DarkLogo, LightLogo } from '../../assets/images';
import { CustomHeader } from '../components';
import {
  Button,
  Divider,
  Text,
  TextInput,
  TextInputType,
  AppleSignInButton,
  RadioButton,
} from '../core-ui';
import { errorHandler, getImage, useStorage } from '../helpers';
import {
  useActivateAccount,
  useAuthenticateLoginLink,
  useLogin,
  useLoginWithApple,
  usePushNotificationsToken,
  useRequestLoginLink,
  useSiteSettings,
} from '../hooks';
import { makeStyles, useColorScheme } from '../theme';
import { ASAuthorizationError, StackNavProp, StackRouteProp } from '../types';
import { useRedirect } from '../utils';
import { useAuth } from '../utils/AuthProvider';
import { usePluginStatus } from '../hooks/site/usePluginStatus';
import { LoginOutputFragment } from '../generated/server';
import { ERROR_UNEXPECTED, LOGIN_LINK_SUCCESS_ALERT } from '../constants';

type Form = {
  email: string;
  password: string;
};

let tempUser = { email: '', password: '' };

export default function Login() {
  const { colorScheme } = useColorScheme();
  const { canSignUp = false } = useSiteSettings();
  const { appleLoginEnabled, loginLinkEnabled } = usePluginStatus();
  const storage = useStorage();
  const { setTokenState } = useAuth();
  const styles = useStyles();
  const { redirectPath, setRedirectPath, handleRedirect } = useRedirect();
  const { params } = useRoute<StackRouteProp<'Login'>>();

  const [hidePassword, setHidePassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loginWithLink, setLoginWithLink] = useState(false);

  const { navigate } = useNavigation<StackNavProp<'Login'>>();
  const { syncToken } = usePushNotificationsToken();
  const { requestLoginLink } = useRequestLoginLink({
    onCompleted: ({ requestLoginLink }) => {
      if (requestLoginLink === 'success') {
        Alert.alert(
          t('Success!'),
          LOGIN_LINK_SUCCESS_ALERT,
          [{ text: 'Got it' }],
          { cancelable: false },
        );
      }
    },
  });

  const ios = Platform.OS === 'ios';

  const onLoginCompleted = async (data: LoginOutputFragment) => {
    setTokenState(data.token);
    let { user, enableLexiconPushNotifications } = data;
    storage.setItem('user', {
      id: user.id,
      username: user.username,
      name: user.name ?? '',
      avatar: getImage(user.avatar),
      trustLevel: user.trustLevel,
      groups: user.groups.map((group) => group.name),
    });

    if (enableLexiconPushNotifications) {
      syncToken();
    }
    if (redirectPath) {
      handleRedirect();
      setRedirectPath('');
    }
  };
  const { login, loading: loginLoading } = useLogin({
    onCompleted: ({ login: authUser }) => {
      // eslint-disable-next-line no-underscore-dangle
      if (authUser.__typename === 'LoginOutput') {
        onLoginCompleted(authUser);
        // eslint-disable-next-line no-underscore-dangle
      } else if (authUser.__typename === 'SecondFactorRequired') {
        navigate('TwoFactorAuth', tempUser);
      }
    },
    onError: (error) => {
      setErrorMsg(errorHandler(error));
    },
  });
  const { loginWithApple, loading: loginWithAppleLoading } = useLoginWithApple({
    onCompleted: ({ loginWithApple }) => {
      onLoginCompleted(loginWithApple);
    },
    onError: (error) => {
      setErrorMsg(errorHandler(error));
    },
  });
  const { activateAccount, loading: activateAccountLoading } =
    useActivateAccount({
      onCompleted: ({ activateAccount }) => {
        Alert.alert(
          t('Success!'),
          t('Your new account is confirmed'),
          [{ text: 'Got it' }],
          { cancelable: false },
        );
        onLoginCompleted(activateAccount);
      },
    });
  const { authenticateLoginLink, loading: loginLinkLoading } =
    useAuthenticateLoginLink({
      onCompleted: ({ authenticateLoginLink }) => {
        onLoginCompleted(authenticateLoginLink);
      },
    });

  const passwordInputRef = useRef<TextInputType>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    formState,
    trigger,
  } = useForm<Form>({
    mode: 'onChange',
  });

  const onPressSignup = () => {
    Keyboard.dismiss();
    navigate('Register');
  };

  const onSubmit = handleSubmit(async ({ email, password }) => {
    Keyboard.dismiss();

    if (loginWithLink) {
      requestLoginLink({ variables: { login: email } });
    } else {
      tempUser = { email, password };
      login({
        variables: {
          email,
          password,
        },
      });
    }
  });

  useEffect(() => {
    if (params && params.emailToken) {
      if (params.isActivateAccount) {
        activateAccount({ variables: { token: params.emailToken } });
      } else {
        authenticateLoginLink({ variables: { token: params.emailToken } });
      }
    }
  }, [activateAccount, authenticateLoginLink, params]);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={0}
      style={styles.container}
    >
      <CustomHeader
        title={t('Log In')}
        rightTitle={canSignUp && t('Sign Up')}
        onPressRight={canSignUp ? onPressSignup : undefined}
        noShadow
      />
      <Image
        source={colorScheme === 'dark' ? DarkLogo : LightLogo}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        {errorMsg && (
          <Text color="error" style={styles.spacingBottom}>
            {errorMsg}
          </Text>
        )}
        <Controller
          name="email"
          defaultValue=""
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              testID="Login:TextInput:Email"
              label={t('Username or Email Address')}
              placeholder={t('Enter your username or email address')}
              error={errors.email != null}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoCapitalize="none"
              style={styles.spacingBottom}
            />
          )}
        />
        {loginLinkEnabled && (
          <RadioButton
            selected={loginWithLink}
            onPress={() => {
              setLoginWithLink(!loginWithLink);
              trigger();
            }}
            disabled={false}
            style={styles.radioButton}
            checkCircleIcon={true}
          >
            <Text>{t('Send login link, skip password')}</Text>
          </RadioButton>
        )}
        {!loginWithLink && (
          <Controller
            name="password"
            defaultValue=""
            rules={{ required: !loginWithLink }}
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                testID="Login:TextInput:Password"
                inputRef={passwordInputRef}
                label={t('Password')}
                placeholder={t('Enter your password')}
                error={errors.password != null}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize={'none'}
                textContentType="password"
                secureTextEntry={hidePassword}
                style={styles.spacingBottom}
                rightIcon={'Views'}
                onPressIcon={() => setHidePassword(!hidePassword)}
              />
            )}
          />
        )}
        <Button
          testID="Login:Button:Login"
          content={loginWithLink ? t('Send Link') : t('Log In')}
          large
          onPress={onSubmit}
          loading={loginLoading || loginLinkLoading || activateAccountLoading}
          disabled={!formState.isValid}
        />
        {appleLoginEnabled && ios && (
          <>
            <View style={styles.dividerContainer}>
              <Divider />
              <Text size="s" style={styles.dividerText} color="lightTextDarker">
                {t('OR')}
              </Text>
              <Divider />
            </View>
            <AppleSignInButton
              loading={loginWithAppleLoading}
              disabled={
                loginLoading || loginLinkLoading || activateAccountLoading
              }
              onPress={async () => {
                try {
                  const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  });
                  loginWithApple({
                    variables: {
                      identityToken: credential.identityToken ?? '',
                    },
                  });
                } catch (unknownError) {
                  const errorResult =
                    ASAuthorizationError.safeParse(unknownError);
                  if (errorResult.success) {
                    if (errorResult.data.code !== 'ERR_REQUEST_CANCELED') {
                      setErrorMsg(errorResult.data.message);
                    }
                  } else {
                    Alert.alert(ERROR_UNEXPECTED);
                  }
                }
              }}
            />
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  logo: {
    height: 120,
    width: '100%',
    marginVertical: spacing.xxxl,
    backgroundColor: colors.background,
  },
  inputContainer: {
    paddingHorizontal: spacing.xxl,
  },
  spacingBottom: {
    paddingBottom: spacing.xxl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerText: { marginHorizontal: spacing.l },
  radioButton: { paddingVertical: 0, paddingBottom: spacing.xl },
}));
