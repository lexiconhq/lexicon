import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, ViewProps } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { FIRST_POST_NUMBER } from '../../constants';
import { ActivityIndicator, Divider } from '../../core-ui';
import { getUpdatedLikeCount } from '../../helpers';
import { useLikeTopicOrPost } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { useOngoingLikedTopic } from '../../utils';

import { MetricItem } from './MetricItem';

type Props = {
  title?: string;
  postNumber?: number;
  likePerformedFrom?: 'home-scene' | 'topic-detail';
} & MetricViewProps;

export { Props as MetricsProp };

const DEBOUNCE_WAIT_TIME = 500;

export function Metrics(props: Props) {
  const { likedTopics } = useOngoingLikedTopic();

  const {
    postId,
    topicId,
    viewCount,
    replyCount,
    likeCount: likeCountProps = 0,
    postNumber,
    isLiked,
    isCreator,
    title,
    likePerformedFrom = 'topic-detail',
    onPressReply,
    onPressView,
    ...otherProps
  } = props;

  const [likeData, setLikeData] = useState({
    liked: isLiked,
    likeCount: likeCountProps,
  });
  const isFromHomeScene = likePerformedFrom === 'home-scene';

  const performDebouncedLike = useDebouncedCallback((liked: boolean) => {
    if (liked === isLiked) {
      return;
    }
    like({
      variables: {
        unlike: isLiked,
        ...(isFromHomeScene ? { topicId } : { postId }),
        likeCount: likeCountProps,
      },
    });
  }, DEBOUNCE_WAIT_TIME);

  /**
   * Update like count and liked value for topic replies
   * This is separated from the other useEffect to prevent
   * updating like data for topic replies when ongoing
   * likedTopics value changes
   */
  useEffect(() => {
    const isFirstPost = postNumber === FIRST_POST_NUMBER;
    // Skip updating like count and liked value for topic and first post of topics
    if (isFromHomeScene || isFirstPost) {
      return;
    }
    setLikeData({ likeCount: likeCountProps, liked: isLiked });
  }, [isFromHomeScene, isLiked, likeCountProps, likePerformedFrom, postNumber]);

  /**
   * Update like count and liked value for topic and first post of topics
   * if isFromHomeScene is true, then it's a topic
   * if isFirstPost is true, then it's the first post of topics
   */
  useEffect(() => {
    const isFirstPost = postNumber === FIRST_POST_NUMBER;
    if (!isFromHomeScene && !isFirstPost) {
      return;
    }

    const { liked: likedTopic, likeCount: topicLikeCount } =
      likedTopics[topicId] ?? {};
    let liked = likedTopic ?? isLiked;
    let likeCount = topicLikeCount ?? likeCountProps;

    if (!isFirstPost) {
      setLikeData({ likeCount, liked });
      return;
    }

    /**
     * Revert post like count to not use topic like count
     * Liked value of the topic resembles the liked value of the first post.
     * However, the like counts are different because topic likeCount
     * represents the total of likes within that topic, while post
     * likeCount only represents the number of likes for that post
     */

    likeCount = likeCountProps;

    /**
     * Update post likeCount if topic liked and post liked values are different
     * This means there's an ongoing like action related to this post, so
     * post likeCount should get recalculated
     */
    if (liked !== isLiked) {
      const updatedLikeCount = getUpdatedLikeCount({
        liked,
        previousCount: likeCountProps,
      });
      likeCount = updatedLikeCount;
    }

    setLikeData({ likeCount, liked });
  }, [
    isFromHomeScene,
    isLiked,
    likeCountProps,
    likedTopics,
    postNumber,
    topicId,
  ]);

  // Ensuring debounced callback is called if it hasn't fired when component unmount
  useEffect(() => {
    return () => {
      performDebouncedLike.flush();
    };
  }, [performDebouncedLike]);

  // TODO: Add navigation #800
  const [like] = useLikeTopicOrPost();

  const onPressLike = useCallback(() => {
    setLikeData(({ liked: prevLiked, likeCount: previousCount }) => {
      const liked = !prevLiked;
      const likeCount = getUpdatedLikeCount({
        liked,
        previousCount,
      });
      performDebouncedLike(liked);
      return { liked, likeCount };
    });
  }, [performDebouncedLike]);

  return (
    <MetricsView
      topicId={topicId}
      postId={postId}
      isLiked={likeData.liked}
      likeCount={likeData.likeCount}
      replyCount={replyCount}
      viewCount={viewCount}
      isCreator={isCreator}
      onPressLike={onPressLike}
      onPressReply={onPressReply}
      onPressView={onPressView}
      {...otherProps}
    />
  );
}

type MetricViewProps = ViewProps & {
  topicId: number;
  postList?: boolean;
  replyCount: number;
  likeCount: number;
  isLiked: boolean;
  postId?: number;
  viewCount?: number;
  isCreator?: boolean;
  onPressLike?: () => void;
  onPressReply?: (params: { postId?: number; topicId: number }) => void;
  onPressView?: () => void;
};

function BaseMetricsView(props: MetricViewProps) {
  const {
    topicId,
    postList = false,
    replyCount,
    likeCount,
    isLiked,
    postId,
    viewCount,
    isCreator,
    onPressReply,
    onPressLike,
    onPressView,
    style,
    ...otherProps
  } = props;

  const styles = useStyles();
  const { colors } = useTheme();
  let isLoading = !postId && !postList;

  return (
    <View
      style={[styles.container, style, isLoading && styles.metricLoading]}
      {...otherProps}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          {viewCount != null && (
            <>
              <MetricItem
                type="Views"
                count={viewCount}
                onPress={onPressView}
              />
              <Divider vertical horizontalSpacing="xl" />
            </>
          )}
          <MetricItem
            type="Likes"
            count={likeCount}
            onPress={onPressLike}
            disabled={isCreator}
            color={isLiked ? colors.liked : colors.textLighter}
            style={styles.likes}
          />
          <MetricItem
            type="Replies"
            count={replyCount}
            onPress={() => onPressReply?.({ postId, topicId })}
          />
        </>
      )}
    </View>
  );
}

let MetricsView = memo(BaseMetricsView);

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  metricLoading: {
    justifyContent: 'center',
  },
  likes: {
    paddingRight: spacing.xl,
  },
}));
