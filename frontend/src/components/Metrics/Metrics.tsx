import React, { useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';

import { ActivityIndicator, Divider } from '../../core-ui';
import { useLikePost } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { usePost } from '../../utils';

import { MetricItem } from './MetricItem';

type Props = ViewProps & {
  postId: number;
  topicId: number;
  postList?: boolean;
  viewCount?: number;
  baseLikeCount: number;
  replyCount: number;
  onPressReply?: (postId: number) => void;
  isCreator?: boolean;
  baseIsLiked: boolean;
  onPressView?: () => void;
  title?: string;
  likedTopic?: Array<number>;
  slide?: boolean;
  nestedComment?: boolean;
};

export { Props as MetricsProp };

export function Metrics(props: Props) {
  const { onLikedStatusChanged, likedTopic } = usePost();
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    postId,
    topicId,
    postList = false,
    viewCount,
    replyCount,
    baseLikeCount,
    baseIsLiked,
    onPressReply,
    isCreator,
    style,
    onPressView,
    title,
    slide,
    nestedComment = false,
    ...otherProps
  } = props;

  const [isLiked, setIsLiked] = useState(baseIsLiked);
  const [pastRequest, setPastRequest] = useState(baseIsLiked);
  const [likeCount, setLikeCount] = useState(0);
  const [counter, setCounter] = useState(baseLikeCount);
  const [tempLiked, setTempLiked] = useState<Array<number>>([]);
  const [tempLikedShadow, setTempLikedShadow] = useState<Array<number>>([]);

  useEffect(() => {
    if (likedTopic) {
      setTempLiked(likedTopic);
      setTempLikedShadow(likedTopic);
    }
  }, [likedTopic, postId]);

  useEffect(() => {
    setLikeCount(baseLikeCount);
  }, [baseLikeCount]);

  const { like, loading } = useLikePost(
    likeCount,
    setLikeCount,
    postList,
    postId,
    tempLiked,
    setTempLiked,
    tempLikedShadow,
    setTempLikedShadow,
    counter,
    setCounter,
  );

  const onPressLike = () => {
    if (!slide && !nestedComment) {
      if (!likedTopic.includes(topicId)) {
        setPastRequest(false);
        onLikedStatusChanged(topicId, true);
      } else {
        setPastRequest(true);
        onLikedStatusChanged(topicId, false);
      }
    }
    if (!postList) {
      let currentLikeStatus = nestedComment
        ? isLiked
        : likedTopic.includes(topicId);
      if (currentLikeStatus) {
        setLikeCount(likeCount - 1);
        setIsLiked(false);
      } else {
        setLikeCount(likeCount + 1);
        setIsLiked(true);
      }
      like({
        variables: {
          postId,
          unlike: currentLikeStatus,
        },
      });
    }
  };

  return (
    <View
      style={[styles.container, style, postId === 0 && styles.metricLoading]}
      {...otherProps}
    >
      {postId === 0 ? (
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
            onPressOut={() => {
              if (
                !slide &&
                postList &&
                likedTopic.includes(topicId) !== pastRequest
              ) {
                setPastRequest(likedTopic.includes(topicId));
                like({
                  variables: {
                    postId,
                    unlike: !likedTopic.includes(topicId),
                    postList: true,
                  },
                });
              }
            }}
            delayPressOut={1000}
            activeOpacity={0.8}
            disabled={postList ? !!isCreator : isCreator || loading}
            color={
              !nestedComment
                ? likedTopic.includes(topicId)
                  ? colors.liked
                  : colors.textLighter
                : isLiked
                ? colors.liked
                : colors.textLighter
            }
            style={styles.likes}
          />
          <MetricItem
            type="Replies"
            count={replyCount}
            onPress={() => {
              onPressReply ? onPressReply(postId) : () => {};
            }}
          />
        </>
      )}
    </View>
  );
}

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
