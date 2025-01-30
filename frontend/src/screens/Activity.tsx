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
import { useDevice } from '../utils';

export default function Activity() {
  const styles = useStyles();
  const { isTablet } = useDevice();

  const storage = useStorage();
  const user = storage.getItem('user');
  const username = user ? user.username : '';

  const { data, loading, error, refetch, fetchMore } = useActivity({
    variables: { username, offset: 0 },
  });

  const activities = data?.activity ?? [];

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
    return <LoadingOrError style={styles.loadingContainer} loading />;
  }

  let content;
  if (activities.length !== 0) {
    content = (
      <PostList
        data={activities}
        scrollEventThrottle={16}
        alwaysBounceVertical={true}
        contentContainerStyle={
          isTablet
            ? [styles.tabletContentContainer, styles.tabletBackground]
            : styles.contentContainer
        }
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
              style={isTablet && styles.tabletPostItem}
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

  return (
    <View style={[styles.container, isTablet && styles.tabletBackground]}>
      {content}
    </View>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  contentContainer: {
    paddingTop: spacing.m,
  },
  tabletContentContainer: {
    paddingHorizontal: spacing.xxxxxl,
    paddingTop: spacing.l,
  },
  tabletPostItem: {
    marginBottom: spacing.l,
    borderRadius: 8,
  },
  tabletBackground: { backgroundColor: colors.backgroundDarker },
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
  loadingContainer: {
    backgroundColor: colors.background,
  },
}));
