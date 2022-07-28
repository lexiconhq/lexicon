import React from 'react';
import { View } from 'react-native';

import { LoadingOrError, PostList } from '../components';
import { DEFAULT_CHANNEL } from '../constants';
import { Text } from '../core-ui';
import { TopicsSortEnum } from '../generated/server/types';
import {
  anchorToMarkdown,
  errorHandler,
  getImage,
  useStorage,
} from '../helpers';
import { useActivity, useTopicList } from '../hooks';
import { makeStyles } from '../theme';
import { Post } from '../types';

export default function Activity() {
  const styles = useStyles();

  const storage = useStorage();
  const channels = storage.getItem('channels');
  const user = storage.getItem('user');
  const username = user ? user.username : '';

  const {
    data: topicsData,
    loading: topicsLoading,
    error: topicsError,
  } = useTopicList({
    variables: { sort: TopicsSortEnum.Latest },
  });

  const { data, loading, error, refetch, fetchMore } = useActivity({
    variables: { username, offset: 0 },
  });

  const activities = data?.userActivity ?? [];
  let postActivities: Array<Post> = [];

  postActivities = activities.map((activity) => {
    const channel = channels?.find(
      (channel) => channel.id === activity.categoryId,
    );
    let topic;
    const listedTopics = topicsData?.topics.topicList;
    if (listedTopics?.topics) {
      topic = listedTopics.topics.find(
        (topic) => topic.id === activity.topicId,
      );
    }
    const { content, imageUrl, mentionedUsers } = anchorToMarkdown(
      activity.excerpt,
    );

    return {
      ...activity,
      id: activity.postId ?? 0,
      content,
      images: imageUrl ? [imageUrl] : undefined,
      avatar: getImage(activity.avatarTemplate),
      viewCount: 0,
      replyCount: 0,
      likeCount: 0,
      isLiked: activity.actionType === 1,
      channel: channel || DEFAULT_CHANNEL,
      tags: topic?.tags || [],
      freqPosters: [],
      mentionedUsers,
    };
  });

  const onEndReached = (distanceFromEnd: number) => {
    if (distanceFromEnd === 0) {
      return;
    }
    fetchMore({ variables: { offset: postActivities.length } });
  };

  const onRefresh = () => refetch();

  if (error || topicsError) {
    let errorMessage = error
      ? errorHandler(error, true)
      : topicsError
      ? errorHandler(topicsError, true)
      : undefined;
    return <LoadingOrError message={errorMessage} />;
  }

  if ((loading || topicsLoading) && postActivities.length < 1) {
    return <LoadingOrError loading />;
  }

  let content;
  if (postActivities.length !== 0) {
    content = (
      <PostList
        data={postActivities}
        showLabel={true}
        currentUser={username}
        scrollEventThrottle={16}
        alwaysBounceVertical={true}
        hasFooter={false}
        contentContainerStyle={styles.contentContainer}
        showImageRow
        style={styles.fill}
        onEndReachedThreshold={0.1}
        onEndReached={({ distanceFromEnd }) => onEndReached(distanceFromEnd)}
        onRefresh={onRefresh}
        refreshing={loading}
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
