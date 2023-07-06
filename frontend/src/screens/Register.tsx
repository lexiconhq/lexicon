import React, { useRef, useState } from 'react';
import { Alert, Image, Keyboard, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';

import { DarkLogo, LightLogo } from '../../assets/images';
import { CustomHeader } from '../components';
import { Button, TextInput, TextInputType } from '../core-ui';
import { errorHandler, getTextInputRules } from '../helpers';
import { useRegister, useSiteSettings } from '../hooks';
import { makeStyles, useColorScheme } from '../theme';
import { StackNavProp } from '../types';

type Form = {
  email: string;
  username: string;
  name: string;
  password: string;
};

export default function Register() {
  const { colorScheme } = useColorScheme();
  const styles = useStyles();

  const { goBack } = useNavigation<StackNavProp<'Register'>>();

  const {
    maxUsernameLength,
    minUsernameLength,
    minPasswordLength,
    fullNameRequired,
  } = useSiteSettings();

  const [hidePassword, setHidePassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, loading } = useRegister({
    onCompleted: ({ register }) => {
      if (register.success) {
        Alert.alert(
          t('Please Check Your Email'),
          t('We sent you a link to your email to confirm your account.'),
          [{ text: t('Got it') }],
        );
        goBack();
      } else {
        setErrorMsg(register.message);
      }
    },
    onError: (error) => {
      setErrorMsg(errorHandler(error));
    },
  });

  const usernameInputRef = useRef<TextInputType>(null);
  const nameInputRef = useRef<TextInputType>(null);
  const passwordInputRef = useRef<TextInputType>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<Form>({
    mode: 'onChange',
  });

  const { usernameInputRules, nameInputRules, passwordInputRules } =
    getTextInputRules({
      maxUsernameLength,
      minUsernameLength,
      minPasswordLength,
      fullNameRequired,
    });

  const onSubmit = handleSubmit(({ email, username, name, password }) => {
    Keyboard.dismiss();
    register({
      variables: {
        registerInput: {
          email,
          username,
          name,
          password,
        },
      },
    });
  });

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={0}
      style={styles.container}
    >
      <CustomHeader title={t('Sign Up')} noShadow />
      <Image
        source={colorScheme === 'dark' ? DarkLogo : LightLogo}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        {errorMsg !== '' && <Text style={styles.errorMsg}>{errorMsg}</Text>}
        <Controller
          name="email"
          defaultValue=""
          rules={{
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('Invalid email address'),
            },
          }}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              label={t('Email Address')}
              placeholder={t('Insert your email address')}
              error={errors.email != null}
              errorMsg={errors.email?.message}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => usernameInputRef.current?.focus()}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              style={styles.spacingBottom}
            />
          )}
        />
        <Controller
          name="username"
          defaultValue=""
          rules={usernameInputRules}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              inputRef={usernameInputRef}
              label={t('Username')}
              placeholder={t('Insert your username')}
              error={errors.username != null}
              errorMsg={errors.username?.message}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => nameInputRef.current?.focus()}
              autoCapitalize="none"
              style={styles.spacingBottom}
            />
          )}
        />
        <Controller
          name="name"
          defaultValue=""
          rules={nameInputRules}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              inputRef={nameInputRef}
              label={t('Name')}
              placeholder={t('Insert your name')}
              error={errors.name != null}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoCapitalize="words"
              style={styles.spacingBottom}
            />
          )}
        />
        <Controller
          name="password"
          defaultValue=""
          rules={passwordInputRules}
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              inputRef={passwordInputRef}
              label={t('Password')}
              placeholder={t('Insert your password')}
              error={errors.password != null}
              errorMsg={errors.password?.message}
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
          content={t('Create New Account')}
          large
          onPress={onSubmit}
          loading={loading}
          disabled={!formState.isValid}
        />
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerStyle}>
            {t('By registering, you agree to the ')}
            <Text style={styles.inlineColor}>{t('privacy policy ')}</Text>
            {t('and ')}
            <Text style={styles.inlineColor}>{t('terms of service')}</Text>
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  logo: {
    height: 120,
    width: '100%',
    marginVertical: spacing.xxxl,
  },
  disclaimerContainer: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  disclaimerStyle: {
    color: colors.textLight,
    fontSize: fontSizes.m,
  },
  inlineColor: {
    color: colors.primary,
  },
  errorMsg: {
    color: colors.error,
    paddingBottom: spacing.xxl,
  },
  inputContainer: {
    paddingHorizontal: spacing.xxl,
  },
  spacingBottom: {
    paddingBottom: spacing.xxl,
  },
}));
