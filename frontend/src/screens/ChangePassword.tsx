import React, { useEffect, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CustomHeader } from '../components';
import { Button, Text } from '../core-ui';
import { Profile_userProfile_user_UserDetail as UserDetail } from '../generated/server/Profile';
import { useStorage } from '../helpers';
import { useChangePassword, useProfile } from '../hooks';
import { makeStyles } from '../theme';
import { StackNavProp } from '../types';

export default function ChangePassword() {
  const storage = useStorage();
  const styles = useStyles();

  const { goBack } = useNavigation<StackNavProp<'ChangePassword'>>();

  const { data: userData } = useProfile(
    {
      variables: { username: storage.getItem('user')?.username || '' },
    },
    'HIDE_ALERT',
  );

  const [errorMessage, setError] = useState(false);
  const [user, setUser] = useState<UserDetail>({
    __typename: 'UserDetail',
    avatar: '',
    bioRaw: '',
    dateOfBirth: '',
    location: '',
    name: '',
    username: '',
    websiteName: '',
    email: '',
    secondaryEmails: [],
    unconfirmedEmails: [],
    canEditUsername: true,
    admin: true,
  });

  const ios = Platform.OS === 'ios';

  useEffect(() => {
    if (userData) {
      // eslint-disable-next-line no-underscore-dangle
      userData.userProfile.user.__typename === 'UserDetail' &&
        setUser(userData.userProfile.user);
    }
  }, [userData, setUser]);

  const { changeNewPassword, loading, error } = useChangePassword({
    onCompleted: () => {
      Alert.alert(
        t('Success!'),
        t('You should receive an email to change your password shortly'),
        [{ text: 'Got it' }],
        { cancelable: false },
      );
      goBack();
    },
    onError: () => {
      setError(true);
    },
  });

  const email = user.email;

  const onPressSend = () => {
    setError(false);
    changeNewPassword({
      variables: {
        email,
      },
    });
  };

  return (
    <View style={styles.container}>
      {!ios ? (
        <CustomHeader title={t('Change Password')} />
      ) : (
        <CustomHeader
          title={t('Change Password')}
          rightTitle={t('Send')}
          onPressRight={onPressSend}
          isLoading={loading}
        />
      )}
      <View style={styles.inputContainer}>
        {errorMessage && (
          <Text color="error" style={styles.spacingBottom}>
            {error?.message}
          </Text>
        )}
        <Text style={styles.disclaimerStyle}>{t('Email')}</Text>
        <Text style={styles.spacingBottom}>{user.email}</Text>
        <Text style={styles.disclaimerStyle}>
          {t(
            'We will send a link to your email address to change your password.',
          )}
        </Text>
      </View>
      {!ios && (
        <View style={styles.buttonContainer}>
          <Button
            content="Send Email"
            large
            onPress={onPressSend}
            loading={loading}
          />
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  disclaimerStyle: {
    color: colors.textLight,
    fontSize: fontSizes.s,
  },
  inputContainer: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  spacingBottom: {
    paddingBottom: spacing.xl,
  },
  buttonContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginVertical: spacing.xl,
    marginHorizontal: spacing.l,
  },
}));
