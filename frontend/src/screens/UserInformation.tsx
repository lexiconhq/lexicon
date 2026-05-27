import { useReactiveVar } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import {
  BlockedUserContent,
  HiddenWordsContent,
  CustomHeader,
  LoadingOrError,
  Markdown,
  PostList,
  ShowImageModal,
  UserInformationPostItem,
  UserStatus,
} from '../components';
import { Avatar, Button, Text } from '../core-ui';
import {
  errorHandler,
  getImage,
  shouldHidePostByHiddenWords,
  useBlockUserActions,
  useStorage,
} from '../helpers';
import { navigate as rootNavigate } from '../navigation/NavigationService';
import { useActivity, useProfile } from '../hooks';
import { makeStyles } from '../theme';
import { NewPostForm, StackNavProp, StackRouteProp } from '../types';
import { tokenVar } from '../reactiveVars';
import { useHiddenWords } from '../utils';

export default function UserInformation() {
  const styles = useStyles();

  const { navigate } = useNavigation<StackNavProp<'UserInformation'>>();

  const {
    params: { username },
  } = useRoute<StackRouteProp<'UserInformation'>>();
  const { reset: resetForm } = useFormContext<NewPostForm>();

  const storage = useStorage();
  const token = useReactiveVar(tokenVar);
  const currentUser = storage.getItem('user')?.username;
  const {
    canBlockUsername,
    isBlocked,
    promptBlock,
    promptUnblock,
    isUpdating,
  } = useBlockUserActions();
  const { hiddenWords, profileMatchesHiddenWords } = useHiddenWords();

  const [show, setShow] = useState<boolean>();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useProfile(
    {
      variables: { username, skipNotifications: !token },
    },
    'HIDE_ALERT',
  );

  const profileUser = profileData?.profile.user;
  const userIsBlocked =
    isBlocked(username) || profileUser?.ignored === true;
  const profileHiddenByWords = profileUser
    ? profileMatchesHiddenWords(profileUser)
    : false;
  const canManageBlock = canBlockUsername(username);

  const name = profileUser?.name || '';
  const userImage = getImage(profileUser?.avatar || '', 'xl');
  const bio = profileUser?.bioRaw;
  const splittedBio = bio ? bio.split(/\r\n|\r|\n/) : [''];
  const statusUser = profileData && profileData.profile?.user.status;

  const { data, loading, error, networkStatus, refetch, fetchMore } =
    useActivity({ variables: { username: username, offset: 0 } }, 'HIDE_ALERT');

  const visibleActivities = useMemo(() => {
    const activities = data?.activity ?? [];
    if (userIsBlocked || profileHiddenByWords) {
      return [];
    }
    return activities.filter(
      (activity) =>
        !shouldHidePostByHiddenWords(
          {
            title: activity.title,
            content: activity.markdownContent || activity.excerpt || '',
            username: activity.username,
          },
          hiddenWords,
        ),
    );
  }, [data?.activity, hiddenWords, profileHiddenByWords, userIsBlocked]);

  const onEndReached = (distanceFromEnd: number) => {
    if (distanceFromEnd === 0 || userIsBlocked) {
      return;
    }
    fetchMore({ variables: { offset: data?.activity?.length ?? 0 } });
  };

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    refetchProfile();
    setRefreshing(false);
  };

  const onPressCancel = () => {
    setShow(false);
  };

  const onPressMessage = () => {
    if (!token) {
      rootNavigate('Welcome');
      return;
    }
    resetForm({
      messageTargetSelectedUsers: [username],
      messageUsersList: [{ name, username, avatar: userImage }],
      draftKey: '',
    });
    navigate('NewMessage');
  };

  const onPressBlock = () => {
    promptBlock(username);
  };

  const onPressUnblock = () => {
    promptUnblock(username);
  };

  if (error || profileError) {
    let errorMessage = error
      ? errorHandler(error, true)
      : profileError
      ? errorHandler(profileError, true)
      : undefined;
    return <LoadingOrError message={errorMessage} />;
  }

  if (
    !userIsBlocked &&
    !profileHiddenByWords &&
    (loading || profileLoading || (data && data.activity?.length !== 0)) &&
    (data?.activity ?? []).length < 1
  ) {
    return <LoadingOrError loading />;
  }

  const Header = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <CustomHeader title="" noShadow />
          <Avatar
            src={userImage}
            size="l"
            label={username[0]}
            onPress={() => {
              setShow(true);
            }}
          />
          <View style={styles.usernameText}>
            <Text variant="semiBold" size="l">
              {username}
            </Text>
          </View>
          <Markdown
            content={
              splittedBio
                ? splittedBio.length > 3
                  ? `${splittedBio.slice(0, 3).join('\n')}...`
                  : bio
                  ? bio
                  : ''
                : ''
            }
            style={styles.bioContainer}
          />
          {statusUser && (
            <UserStatus
              emojiCode={statusUser.emoji}
              status={statusUser.description}
              styleContainer={styles.statusContainer}
            />
          )}
          <View style={styles.buttonContainer}>
            {currentUser !== username && !userIsBlocked && (
              <Button
                content={token ? t('Message') : t('Sign-In To Message')}
                onPress={onPressMessage}
                style={styles.actionButton}
              />
            )}
            {canManageBlock && (
              <Button
                content={userIsBlocked ? t('Unblock') : t('Block')}
                outline={userIsBlocked}
                onPress={userIsBlocked ? onPressUnblock : onPressBlock}
                disabled={isUpdating}
                style={styles.actionButton}
              />
            )}
          </View>
        </View>
        {!userIsBlocked && !profileHiddenByWords ? (
          <Text variant={'semiBold'} style={styles.activityText}>
            {t('Activity')}
          </Text>
        ) : null}
      </>
    );
  };

  if (userIsBlocked) {
    return (
      <View style={styles.container}>
        <Header />
        <BlockedUserContent
          username={username}
          showUnblock={canManageBlock}
          onUnblock={onPressUnblock}
          isUpdating={isUpdating}
        />
        <ShowImageModal
          show={show || false}
          userImage={{ uri: userImage }}
          onPressCancel={onPressCancel}
        />
      </View>
    );
  }

  if (profileHiddenByWords) {
    return (
      <View style={styles.container}>
        <Header />
        <HiddenWordsContent />
        <ShowImageModal
          show={show || false}
          userImage={{ uri: userImage }}
          onPressCancel={onPressCancel}
        />
      </View>
    );
  }

  let content;
  if (visibleActivities.length !== 0) {
    content = (
      <PostList
        ListHeaderComponent={<Header />}
        data={visibleActivities}
        onRefresh={onRefresh}
        refreshing={networkStatus === 4 || refreshing}
        scrollEventThrottle={16}
        alwaysBounceVertical={true}
        style={styles.fill}
        onEndReachedThreshold={0.1}
        onEndReached={({ distanceFromEnd }) => onEndReached(distanceFromEnd)}
        renderItem={({ item }) => {
          return (
            <UserInformationPostItem
              topicId={item.topicId}
              postId={item.postId}
              actionType={item.actionType}
              currentUser={username}
            />
          );
        }}
        testID="UserInformation:PostList"
      />
    );
  } else {
    content = (
      <View style={styles.noActivity}>
        <Header />
        <Text style={styles.noActivityText}>
          {t("This user doesn't have any activity")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {content}
      <ShowImageModal
        show={show || false}
        userImage={{ uri: userImage }}
        onPressCancel={onPressCancel}
      />
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  usernameText: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.s,
  },
  bioContainer: {
    paddingHorizontal: spacing.xxl,
  },
  statusContainer: {
    marginTop: spacing.m,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: spacing.xl,
    marginTop: spacing.m,
    paddingHorizontal: spacing.xl,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  actionButton: {
    minWidth: 120,
    marginHorizontal: spacing.s,
    marginBottom: spacing.s,
  },
  activityText: {
    paddingLeft: spacing.xl,
    paddingVertical: spacing.xl,
  },
  fill: {
    width: '100%',
    flexGrow: 1,
  },
  noActivity: {
    width: '100%',
  },
  noActivityText: {
    alignSelf: 'center',
  },
}));
