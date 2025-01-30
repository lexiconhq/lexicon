import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Platform, View } from 'react-native';

import { CustomHeader } from '../components';
import { Button, Text, TextInput } from '../core-ui';
import { ProfileDocument } from '../generatedAPI/server';
import { useStorage } from '../helpers';
import { useAddEmail } from '../hooks';
import { makeStyles } from '../theme';
import { StackNavProp } from '../types';
import { useDevice } from '../utils';

type Form = {
  email: string;
};

export default function AddEmail() {
  const styles = useStyles();
  const { isTabletLandscape } = useDevice();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    formState,
    reset,
  } = useForm<Form>({
    mode: 'onChange',
  });

  const [success, setSuccess] = useState(false);

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

  const navigation = useNavigation<StackNavProp<'AddEmail'>>();
  const { goBack, navigate } = navigation;

  const ios = Platform.OS === 'ios';

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      reset();
    });

    return unsubscribe;
  }, [navigation, reset]);

  const {
    addEmailAddress,
    loading: addEmailAddressLoading,
    error: addEmailAddressError,
  } = useAddEmail({
    onCompleted: () => {
      setSuccess(true);
      Alert.alert(
        'Success!',
        t('{newEmail} has been successfully added', {
          newEmail: getValues('email'),
        }),
        [
          {
            text: t('Got it'),
            onPress: () => {
              if (isTabletLandscape) {
                navigate('EmailAddress');
              } else {
                goBack();
              }
            },
          },
        ],
      );
    },
    onError: () => {},
    refetchQueries: [
      {
        query: ProfileDocument,
        variables: { username },
      },
    ],
  });

  const onPressSend = handleSubmit(({ email }) => {
    setSuccess(false);
    if (email.trim() !== '') {
      addEmailAddress({
        variables: {
          addEmailInput: {
            email,
          },
          username,
        },
      });
    }
  });

  return (
    <View style={styles.container}>
      {success || !ios ? (
        <CustomHeader
          title={t('New Email Address')}
          prevScreen="EmailAddress"
        />
      ) : (
        <CustomHeader
          title={t('New Email Address')}
          rightTitle={t('Add')}
          onPressRight={onPressSend}
          disabled={!formState.isValid}
          isLoading={addEmailAddressLoading}
          prevScreen="EmailAddress"
        />
      )}
      <View style={styles.inputContainer}>
        {addEmailAddressError && (
          <Text color="error" style={styles.spacingBottom}>
            {t('{message}', { message: addEmailAddressError.message })}
          </Text>
        )}
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
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={t('Email Address')}
              placeholder={t('Insert your email address')}
              error={errors.email != null}
              errorMsg={errors.email?.message}
              value={value}
              onChangeText={onChange}
              returnKeyType="next"
              autoCapitalize="none"
              style={styles.spacingBottom}
            />
          )}
        />
      </View>
      {!ios && !success && (
        <View style={styles.buttonContainer}>
          <Button
            content="Add Email Address"
            large
            onPress={onPressSend}
            loading={addEmailAddressLoading}
            disabled={!formState.isValid}
          />
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  inputContainer: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  spacingBottom: {
    paddingBottom: spacing.xxl,
  },
  buttonContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginVertical: spacing.xl,
    marginHorizontal: spacing.l,
  },
}));
