import React, { useState } from 'react';
import { Image, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';

import { DarkLogo, LightLogo } from '../../assets/images';
import { CustomHeader } from '../components';
import { Button, Text, TextInput } from '../core-ui';
import { errorHandler, getImage, setToken, useStorage } from '../helpers';
import { useLogin } from '../hooks';
import { makeStyles, useColorScheme } from '../theme';
import { StackNavProp, StackRouteProp } from '../types';

type TwoFactorForm = {
  code: number;
};

export default function TwoFactorAuth() {
  const { colorScheme } = useColorScheme();
  const storage = useStorage();
  const styles = useStyles();

  const { reset, navigate } = useNavigation<StackNavProp<'TwoFactorAuth'>>();

  const { params } = useRoute<StackRouteProp<'TwoFactorAuth'>>();

  const [hidePassword, setHidePassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, loading } = useLogin({
    onCompleted: ({ login: authUser }) => {
      const { __typename: responseType } = authUser;

      if (responseType === 'LoginOutput') {
        setToken(authUser.token);
        let { user } = authUser;
        storage.setItem('user', {
          id: user.id,
          username: user.username,
          name: user.name ?? '',
          avatar: getImage(user.avatar),
        });
        reset({ index: 0, routes: [{ name: 'TabNav' }] });
      } else if (responseType === 'SecondFactorRequired') {
        setErrorMsg(authUser.error);
      }
    },
    onError: (error) => {
      setErrorMsg(errorHandler(error));
    },
  });

  const { control, handleSubmit, errors, formState } = useForm<TwoFactorForm>({
    mode: 'onChange',
  });

  const onPressSignup = () => {
    Keyboard.dismiss();
    navigate('Register');
  };

  const onSubmit = handleSubmit(({ code }) => {
    Keyboard.dismiss();
    const { email, password } = params;
    const token = code.toString();

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
          defaultValue=""
          rules={{ required: true }}
          control={control}
          render={({ onChange, value }) => (
            <TextInput
              label={t('Code')}
              placeholder={t('Insert your code')}
              error={errors.code != null}
              value={value}
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
