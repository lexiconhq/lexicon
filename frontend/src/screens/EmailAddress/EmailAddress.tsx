import React, { useState } from 'react';
import { FlatList, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CustomHeader, LoadingOrError } from '../../components';
import { FloatingButton } from '../../core-ui';
import { useStorage } from '../../helpers';
import { useProfile } from '../../hooks';
import { makeStyles } from '../../theme';
import { EmailAddress as EmailAddressType, StackNavProp } from '../../types';

import EmailAddressItem from './components/EmailAddressItem';

export default function EmailAddress() {
  const styles = useStyles();

  const { navigate } = useNavigation<StackNavProp<'EmailAddress'>>();

  const [emailAddress, setEmailAddress] = useState<Array<EmailAddressType>>([]);
  const [loading, setLoading] = useState(false);

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

  const ios = Platform.OS === 'ios';

  const { loading: userLoading, refetch } = useProfile({
    variables: { username },
    onCompleted: ({ userProfile: result }) => {
      // eslint-disable-next-line no-underscore-dangle
      if (result.user.__typename === 'UserDetail') {
        const { email, secondaryEmails, unconfirmedEmails } = result.user;
        let temp: Array<EmailAddressType> = [];
        temp[0] = { emailAddress: email, type: 'PRIMARY' };
        secondaryEmails?.forEach((emailAddress) =>
          temp.push({ emailAddress, type: 'SECONDARY' }),
        );
        unconfirmedEmails?.forEach((emailAddress) =>
          temp.push({ emailAddress, type: 'UNCONFIRMED' }),
        );
        setEmailAddress(temp);
        onSetLoading(false);
      }
    },
    fetchPolicy: 'network-only',
  });

  const onSetLoading = (value: boolean) => {
    setLoading(value);
  };

  const onRefresh = () => {
    onSetLoading(true);
    refetch();
  };

  const keyExtractor = ({ emailAddress }: EmailAddressType, index: number) =>
    `${emailAddress}-${index}`;

  const renderItem = ({ item }: { item: EmailAddressType }) => (
    <EmailAddressItem
      emailAddress={item.emailAddress}
      type={item.type}
      onSetLoading={onSetLoading}
    />
  );

  if (userLoading && emailAddress.length === 0) {
    return <LoadingOrError style={styles.loadingContainer} loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {ios && (
        <CustomHeader
          title={t('Email Address')}
          rightIcon="Add"
          onPressRight={() => navigate('AddEmail')}
          disabled={loading}
        />
      )}
      <FlatList
        data={emailAddress}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onRefresh={onRefresh}
        refreshing={userLoading || loading}
      />
      {!ios && (
        <FloatingButton
          style={styles.floatingButton}
          onPress={() => navigate('AddEmail')}
        />
      )}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  floatingButton: {
    flex: 1,
    position: 'absolute',
    marginRight: spacing.xxl,
    marginBottom: spacing.xxxl,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    backgroundColor: colors.background,
  },
}));
