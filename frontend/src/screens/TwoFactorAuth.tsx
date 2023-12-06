import React, { useState } from 'react';
import { Image, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';

import { DarkLogo, LightLogo } from '../../assets/images';
import { CustomHeader } from '../components';
import { Button, Text, TextInput } from '../core-ui';
import { errorHandler, getImage, useStorage } from '../helpers';
import { useLogin } from '../hooks';
import { makeStyles, useColorScheme } from '../theme';
import { StackNavProp, StackRouteProp } from '../types';
import { useRedirect } from '../utils';
import { useAuth } from '../utils/AuthProvider';

type TwoFactorForm = {
  code: string;
};

export default function TwoFactorAuth() {
  const { colorScheme } = useColorScheme();
  const storage = useStorage();
  const styles = useStyles();
  const { setTokenState } = useAuth();
  const { redirectPath, setRedirectPath, handleRedirect } = useRedirect();

  const { navigate } = useNavigation<StackNavProp<'TwoFactorAuth'>>();

  const { params } = useRoute<StackRouteProp<'TwoFactorAuth'>>();

  const [hidePassword, setHidePassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, loading } = useLogin({
    onCompleted: ({ login: authUser }) => {
      const { __typename: responseType } = authUser;

      if (responseType === 'LoginOutput') {
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

        if (redirectPath) {
          handleRedirect();
          setRedirectPath('');
        }
      } else if (responseType === 'SecondFactorRequired') {
        setErrorMsg(authUser.error);
      }
    },
    onError: (error) => {
      setErrorMsg(errorHandler(error));
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<TwoFactorForm>({
    mode: 'onChange',
    defaultValues: { code: '' },
  });

  const onPressSignup = () => {
    Keyboard.dismiss();
    navigate('Register');
  };

  const onSubmit = handleSubmit(({ code }) => {
    Keyboard.dismiss();
    const { email, password } = params;
    const token = code ?? '';

    login({
      variables: {
        email,
        password,
        secondFactorToken: token,
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
        rightTitle={t('Sign Up')}
        onPressRight={onPressSignup}
        noShadow
      />
      <Image
        source={colorScheme === 'dark' ? DarkLogo : LightLogo}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        <Text variant="semiBold" style={styles.subtitle}>
          {t('Two Factor Authentication')}
        </Text>

        <Text
          color={errorMsg ? 'error' : 'textLight'}
          size="s"
          style={styles.content}
        >
          {errorMsg || t('Please enter the authentication code from your app')}
        </Text>

        <Controller
          name="code"
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t('Code')}
              placeholder={t('Insert your code')}
              error={errors.code != null}
              value={(value && value.toString()) || ''}
              onChangeText={onChange}
              textContentType="oneTimeCode"
              keyboardType="number-pad"
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
  },
  inputContainer: {
    paddingHorizontal: spacing.xxl,
  },
  subtitle: {
    paddingBottom: spacing.m,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  spacingBottom: {
    paddingBottom: spacing.xxl,
  },
}));
