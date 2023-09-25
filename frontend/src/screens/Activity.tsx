import React from 'react';
import { View } from 'react-native';

import {
  LoadingOrError,
  PostList,
  UserInformationPostItem,
} from '../components';
import { Text } from '../core-ui';
import { errorHandler, useStorage } from '../helpers';
import { useActivity } from '../hooks';
import { makeStyles } from '../theme';

export default function Activity() {
  const styles = useStyles();

  const storage = useStorage();
  const user = storage.getItem('user');
  const username = user ? user.username : '';

  const { data, loading, error, refetch, fetchMore } = useActivity({
    variables: { username, offset: 0 },
  });

  const activities = data?.userActivity ?? [];

  const onEndReached = (distanceFromEnd: number) => {
    if (distanceFromEnd === 0) {
      return;
    }
    fetchMore({ variables: { offset: activities.length } });
  };

  const onRefresh = () => refetch();

  if (error) {
    let errorMessage = error ? errorHandler(error, true) : undefined;
    return <LoadingOrError message={errorMessage} />;
  }

  if (loading && activities.length < 1) {
    return <LoadingOrError loading />;
  }

  let content;
  if (activities.length !== 0) {
    content = (
      <PostList
        data={activities}
        scrollEventThrottle={16}
        alwaysBounceVertical={true}
        contentContainerStyle={styles.contentContainer}
        style={styles.fill}
        onEndReachedThreshold={0.1}
        onEndReached={({ distanceFromEnd }) => onEndReached(distanceFromEnd)}
        onRefresh={onRefresh}
        refreshing={loading}
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
      />
    );
  } else {
    content = (
      <View style={styles.noActivity}>
        <Text style={styles.noActivityText}>
          {t("You don't have any activity")}
        </Text>
      </View>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const useStyles = makeStyles(({ spacing }) => ({
  contentContainer: {
    paddingTop: spacing.m,
  },
  fill: {
    width: '100%',
    flexGrow: 1,
  },
  noActivity: {
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  noActivityText: {
    alignSelf: 'center',
  },
}));
