import { OperationVariables, useFragment_experimental } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { TopicFragment, TopicFragmentDoc } from '../../generatedAPI/server';
import { Icon } from '../../core-ui';
import {
  transformTopicToPost,
  useBlockUserActions,
  useStorage,
} from '../../helpers';
import { makeStyles, useTheme } from '../../theme';
import { StackNavProp } from '../../types';
import { shouldHideTopicByHiddenWords } from '../../helpers';
import { useBlockedUsers, useHiddenWords } from '../../utils';
import { MetricsProp } from '../Metrics/Metrics';

import { PostItem, PostItemProps } from './PostItem';
import { PostItemFooter } from './PostItemFooter';

type Props = Pick<
  PostItemProps,
  'prevScreen' | 'isHidden' | 'topicId' | 'style'
> &
  Pick<MetricsProp, 'onPressReply'> & {
    /** Bumps when hidden words change so memoized items re-filter. */
    hiddenWordsRevision?: number;
  };

function BaseHomePostItem(props: Props) {
  const { hiddenWordsRevision: _hiddenWordsRevision, ...itemProps } = props;
  const { navigate } = useNavigation<StackNavProp<'TabNav'>>();
  const storage = useStorage();
  const styles = useStyles();
  const { colors } = useTheme();
  const { isBlocked } = useBlockedUsers();
  const { hiddenWords } = useHiddenWords();
  const {
    topicId,
    prevScreen,
    isHidden = false,
    onPressReply,
    style,
  } = itemProps;
  const { canBlockUsername, toggleBlock } = useBlockUserActions();

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
  const topicPost = transformTopicToPost({
    ...cacheTopic,
    channels: channelsData ?? [],
  });

  if (
    isBlocked(topicPost.username) ||
    topicPost.freqPosters?.some((poster) => isBlocked(poster.username)) ||
    shouldHideTopicByHiddenWords(topicPost, hiddenWords)
  ) {
    return null;
  }

  let {
    title,
    avatar,
    username: topicAuthorUsername,
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
  } = topicPost;

  const username = topicAuthorUsername;
  const isCreator = username === storage.getItem('user')?.username;

  const authorActions = canBlockUsername(topicAuthorUsername) ? (
    <Icon
      name="More"
      color={colors.textLighter}
      onPress={() => toggleBlock(topicAuthorUsername)}
      hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
    />
  ) : undefined;

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
      authorActions={authorActions}
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
