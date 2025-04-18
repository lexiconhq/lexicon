import { OperationVariables, useFragment_experimental } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { TopicFragment, TopicFragmentDoc } from '../../generatedAPI/server';
import { transformTopicToPost, useStorage } from '../../helpers';
import { makeStyles } from '../../theme';
import { StackNavProp } from '../../types';
import { MetricsProp } from '../Metrics/Metrics';

import { PostItem, PostItemProps } from './PostItem';
import { PostItemFooter } from './PostItemFooter';

type Props = Pick<
  PostItemProps,
  'prevScreen' | 'isHidden' | 'topicId' | 'style'
> &
  Pick<MetricsProp, 'onPressReply'>;

function BaseHomePostItem(props: Props) {
  const { navigate } = useNavigation<StackNavProp<'TabNav'>>();
  const storage = useStorage();
  const styles = useStyles();

  const { topicId, prevScreen, isHidden = false, onPressReply, style } = props;

  const cacheTopicResult = useFragment_experimental<
    TopicFragment,
    OperationVariables
  >({
    fragment: TopicFragmentDoc,
    fragmentName: 'TopicFragment',
    from: {
      __typename: 'Topic',
      id: topicId,
    },
  });
  let cacheTopic = cacheTopicResult.data;

  if (!cacheTopicResult.complete || !cacheTopic) {
    /**
     * This shouldn't ever happen since postList
     * have always already loaded the topic by this point.
     */
    throw new Error('Post not found');
  }

  let channelsData = storage.getItem('channels');
  let {
    title,
    avatar,
    username,
    channel,
    tags,
    viewCount,
    replyCount,
    likeCount,
    hidden,
    createdAt,
    isLiked,
    freqPosters,
    postNumber,
    content,
    imageUrls,
    pinned,
  } = transformTopicToPost({ ...cacheTopic, channels: channelsData ?? [] });

  const isCreator = username === storage.getItem('user')?.username;

  const onPressPost = () => {
    navigate('PostDetail', {
      topicId,
      prevScreen,
      focusedPostNumber: undefined,
      content,
      hidden: isHidden,
    });
  };

  return (
    <PostItem
      topicId={topicId}
      title={title}
      content={content}
      images={imageUrls}
      avatar={avatar}
      channel={channel}
      tags={tags}
      hidden={hidden}
      createdAt={createdAt}
      username={username}
      isLiked={isLiked}
      numberOfLines={5}
      showImageRow
      pinned={pinned}
      style={style}
      footer={
        <PostItemFooter
          topicId={topicId}
          postList
          viewCount={viewCount}
          likeCount={likeCount}
          replyCount={replyCount}
          isLiked={isLiked}
          isCreator={isCreator}
          postNumber={postNumber}
          frequentPosters={freqPosters.slice(1)}
          likePerformedFrom={'home-scene'}
          onPressReply={onPressReply}
          onPressView={onPressPost}
          style={styles.spacingTop}
        />
      }
    />
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  spacingTop: {
    paddingTop: spacing.m,
  },
}));
let HomePostItem = React.memo(BaseHomePostItem);
export { HomePostItem, Props as HomePostItemProps };
