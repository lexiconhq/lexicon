import React, { useRef, useState } from 'react';
import { Image, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';

import { DarkLogo, LightLogo } from '../../assets/images';
import { CustomHeader } from '../components';
import { Button, Text, TextInput, TextInputType } from '../core-ui';
import { errorHandler, getImage, useStorage } from '../helpers';
import { useLogin, usePushNotificationsToken, useSiteSettings } from '../hooks';
import { makeStyles, useColorScheme } from '../theme';
import { StackNavProp } from '../types';
import { useRedirect } from '../utils';
import { useAuth } from '../utils/AuthProvider';

type Form = {
  email: string;
  password: string;
};

let tempUser = { email: '', password: '' };

export default function Login() {
  const { colorScheme } = useColorScheme();
  const { canSignUp = false } = useSiteSettings();
  const storage = useStorage();
  const { setTokenState } = useAuth();
  const styles = useStyles();
  const { redirectPath, setRedirectPath, handleRedirect } = useRedirect();

  const [hidePassword, setHidePassword] = useState(true);

  const { navigate } = useNavigation<StackNavProp<'Login'>>();
  const { syncToken } = usePushNotificationsToken();
  const { login, loading, error } = useLogin({
    onCompleted: async ({ login: authUser }) => {
      // eslint-disable-next-line no-underscore-dangle
      if (authUser.__typename === 'LoginOutput') {
        setTokenState(authUser.token);
        let { user } = authUser;
        storage.setItem('user', {
          id: user.id,
          username: user.username,
          name: user.name ?? '',
          avatar: getImage(user.avatar),
          trustLevel: user.trustLevel,
          groups: user.groups.map((group) => group.name),
        });
        syncToken();

        if (redirectPath) {
          handleRedirect();
          setRedirectPath('');
        }
        // eslint-disable-next-line no-underscore-dangle
      } else if (authUser.__typename === 'SecondFactorRequired') {
        navigate('TwoFactorAuth', tempUser);
      }
    },
    onError: () => {},
  });

  const passwordInputRef = useRef<TextInputType>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<Form>({
    mode: 'onChange',
  });

  const onPressSignup = () => {
    Keyboard.dismiss();
    navigate('Register');
  };

  const onSubmit = handleSubmit(async ({ email, password }) => {
    Keyboard.dismiss();

    tempUser = { email, password };
    login({
      variables: {
        email,
        password,
      },
    });
  });

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
        {error && (
          <Text color="error" style={styles.spacingBottom}>
            {errorHandler(error)}
          </Text>
        )}
        <Controller
          name="email"
          defaultValue=""
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
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
        <Controller
          name="password"
          defaultValue=""
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
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
        <Button
          content={t('Log In')}
          large
          onPress={onSubmit}
          loading={loading}
          disabled={!formState.isValid}
        />
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
}));
