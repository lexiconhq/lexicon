import { EventArg, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { CustomHeader, HeaderItem, ModalHeader } from '../../components';
import { Button, Divider, Icon, Text } from '../../core-ui';
import { getImage, useStorage } from '../../helpers';
import { useSearchUsers } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { RootStackNavProp, UserMessageProps } from '../../types';

import UserItem from './components/UserItem';

const screen = Dimensions.get('screen');

export default function SelectUser() {
  const styles = useStyles();
  const { colors, navHeader, navNoShadow, spacing } = useTheme();

  const storage = useStorage();
  // use username because name can be empty
  const ownerUsername = storage.getItem('user')?.username ?? '';

  const navigation = useNavigation<RootStackNavProp<'SelectUser'>>();
  const { navigate, setOptions, goBack } = navigation;

  const { getValues, setValue } = useFormContext();

  const { messageTargetSelectedUsers: users, messageUsersList: listOfUser } =
    getValues();

  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedUsers, setSelectedUsers] =
    useState<Array<UserMessageProps>>(listOfUser);
  const [currentUsers, setCurrentUsers] = useState<Array<string>>(users);

  const ios = Platform.OS === 'ios';
  const count = currentUsers.length;

  const { data, loading, error } = useSearchUsers(
    { variables: { search: searchValue } },
    'HIDE_ALERT',
  );

  const onSelectedUser = (username: string) => {
    let tempUsers = new Set(currentUsers);
    let tempUserList = new Set(selectedUsers);
    let chosenList = data?.searchUser.users.filter((user) =>
      user.username.match(username),
    );

    if (tempUsers.has(username)) {
      tempUsers.delete(username);
      tempUserList.forEach((index) => {
        if (index.username === username) {
          tempUserList.delete(index);
        }
      });
    } else {
      chosenList?.forEach((item) => {
        if (item.username === username) {
          tempUserList.add({
            ...item,
            name: item.name || null,
          });
        }
      });
      tempUsers.add(username);
    }
    setSelectedUsers(Array.from(tempUserList));
    setCurrentUsers(Array.from(tempUsers));
  };

  const beforeRemoveListener = useCallback(
    (
      e: EventArg<
        'beforeRemove',
        true,
        {
          action: Readonly<{
            type: string;
            source?: string | undefined;
            target?: string | undefined;
          }>;
        }
      >,
    ) => {
      if (
        JSON.stringify(users) === JSON.stringify(currentUsers) &&
        JSON.stringify(listOfUser) === JSON.stringify(selectedUsers)
      ) {
        return;
      }
      e.preventDefault();
      Alert.alert(t('Discard?'), t('Are you sure you want to discard?'), [
        { text: t('Cancel') },
        {
          text: t('Discard'),
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]);
    },
    [currentUsers, listOfUser, navigation, selectedUsers, users],
  );

  useEffect(() => {
    navigation.addListener('beforeRemove', beforeRemoveListener);
    return () => {
      navigation.removeListener('beforeRemove', beforeRemoveListener);
    };
  }, [navigation, beforeRemoveListener]);

  const doneSelectingUser = () => {
    navigation.removeListener('beforeRemove', beforeRemoveListener);
    setValue('messageTargetSelectedUsers', currentUsers);
    setValue('messageUsersList', selectedUsers);
    navigate('NewMessage');
  };

  const Header = () => {
    const headerTitle =
      count > 0 ? t('{count} Selected', { count }) : t('Select Users');

    return ios ? (
      <ModalHeader
        title={count > 0 ? count + t(' Selected') : t('Select Users')}
        left={<HeaderItem label={t('Cancel')} onPressItem={goBack} left />}
        right={
          <HeaderItem
            label={t('Done')}
            onPressItem={doneSelectingUser}
            loading={searchValue.length > 0 && loading}
            disabled={selectedUsers.length === 0}
          />
        }
      />
    ) : (
      <CustomHeader title={headerTitle} noShadow />
    );
  };

  return (
    <SafeAreaView style={styles.container} testID="SelectUser:SafeAreaView">
      <Header />
      <View style={styles.searchContainer}>
        <Icon name="Search" color={colors.textLighter} />
        <TextInput
          style={styles.searchTextInput}
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder={t('Search for ...')}
          placeholderTextColor={colors.textLighter}
        />
      </View>
      {selectedUsers.length < 1 && (
        <View>
          <Text style={[styles.noUser, { paddingTop: spacing.s }]}>
            {t('Find Users with the Search Bar above.')}
          </Text>
          <Divider style={styles.divider} />
        </View>
      )}
      <View>
        <KeyboardAwareScrollView
          onScrollToTop={() => setOptions({ ...navNoShadow })}
          onScrollBeginDrag={() => setOptions({ ...navHeader })}
          style={styles.scrollViewContainer}
        >
          {data ? (
            data.searchUser.users
              .filter(
                (user) =>
                  user.username &&
                  user.username
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) &&
                  !selectedUsers.some(
                    (selectedUser) =>
                      // This condition checks if `selectedUser.name` is not null or empty.
                      // If it's not empty, it will also check the name condition.
                      // If `selectedUser.name` is empty, only the other conditions are applied.
                      (!selectedUser.name || selectedUser.name === user.name) &&
                      selectedUser.username === user.username &&
                      user.avatar === selectedUser.avatar,
                  ),
              )
              .map((user) => {
                if (user.username !== ownerUsername) {
                  const isCheck = currentUsers.includes(user.username);
                  let userImage = getImage(user.avatar || '');

                  return (
                    <UserItem
                      key={user.username}
                      avatar={userImage}
                      name={user.name || ''}
                      username={user.username}
                      isCheck={isCheck}
                      onSelectedUser={onSelectedUser}
                    />
                  );
                } else {
                  return undefined;
                }
              })
          ) : (
            <Text>{error?.message}</Text>
          )}

          {selectedUsers.length > 0 &&
            selectedUsers.map((user) => {
              if (user.username) {
                const isCheck = currentUsers.includes(user.username);
                let userImage = getImage(user.avatar || '');
                return (
                  <UserItem
                    key={user.username}
                    avatar={userImage}
                    name={user.name || ''}
                    username={user.username}
                    isCheck={isCheck}
                    onSelectedUser={onSelectedUser}
                  />
                );
              }
              return null;
            })}
          {!ios && (
            <Button
              content={loading && searchValue.length !== 0 ? '' : 'Done'}
              style={styles.button}
              onPress={doneSelectingUser}
              loading={searchValue.length > 0 && loading}
              disabled={selectedUsers.length === 0}
            />
          )}
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarker,
    borderRadius: 4,
    padding: spacing.m,
    marginVertical: spacing.m,
    marginHorizontal: spacing.xxl,
  },
  searchTextInput: {
    flex: 1,
    color: colors.textNormal,
    fontSize: fontSizes.m,
    paddingHorizontal: spacing.m,
  },
  noUser: {
    color: colors.textLight,
    fontSize: fontSizes.l,
    paddingHorizontal: spacing.m,
    paddingLeft: spacing.xxl,
    paddingBottom: spacing.l,
  },
  button: {
    height: 44,
    marginVertical: spacing.xl,
    marginHorizontal: spacing.xxl,
  },
  divider: {
    marginHorizontal: spacing.xxl,
  },
  scrollViewContainer: {
    maxHeight: (75 / 100) * screen.height,
  },
}));
