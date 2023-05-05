import React from 'react';
import { OperationVariables, useFragment_experimental } from '@apollo/client';

import {
  postDetailContentHandler,
  transformTopicToPost,
  useStorage,
} from '../../helpers';
import { makeStyles } from '../../theme';
import { MetricsProp } from '../Metrics/Metrics';
import { TopicFragment, TopicFragmentDoc } from '../../generated/server';
import { LoadingOrError } from '../LoadingOrError';
import { Channel } from '../../types';

import { PostItemFooter, PostItemFooterProps } from './PostItemFooter';
import { PostItem, PostItemProps } from './PostItem';

type Props = Required<
  Pick<
    PostItemProps,
    'isHidden' | 'mentionedUsers' | 'onPressViewIgnoredContent'
  >
> &
  Pick<MetricsProp, 'onPressReply'> & {
    topicId: number;
    content: string;
    postDetailContent?: ReturnType<typeof postDetailContentHandler>;
    postId?: number;
  };

function BasePostDetailHeaderItem(props: Props) {
  const storage = useStorage();
  const styles = useStyles();

  const {
    topicId,
    content,
    postDetailContent,
    isHidden,
    mentionedUsers,
    onPressReply,
    onPressViewIgnoredContent,
  } = props;

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
  const cachedTopic = cacheTopicResult.data;
  const username = storage.getItem('user')?.username ?? '';
  let channels = storage.getItem('channels') ?? [];

  const resolvedPostItemPropsResult = resolvePostItemProps({
    postDetailContent,
    cachedTopic,
    username,
    channels,
  });

  if (!resolvedPostItemPropsResult) {
    return <LoadingOrError message="Post not found" />;
  }

  let { postItemProps, postItemFooterProps } = resolvedPostItemPropsResult;
  return (
    <PostItem
      topicId={topicId}
      title={postItemProps.title}
      content={content || postItemProps.content}
      avatar={postItemProps.avatar}
      channel={postItemProps.channel}
      tags={postItemProps.tags}
      isHidden={isHidden}
      createdAt={postItemProps.createdAt}
      username={postItemProps.username}
      isLiked={postItemProps.isLiked}
      mentionedUsers={mentionedUsers}
      onPressViewIgnoredContent={onPressViewIgnoredContent}
      nonclickable
      footer={
        <PostItemFooter
          postId={postItemFooterProps.postId}
          topicId={topicId}
          viewCount={postItemFooterProps.viewCount}
          likeCount={postItemFooterProps.likeCount}
          replyCount={postItemFooterProps.replyCount}
          isLiked={postItemFooterProps.isLiked}
          isCreator={postItemFooterProps.isCreator}
          postNumber={postItemFooterProps.postNumber}
          frequentPosters={postItemFooterProps.frequentPosters.slice(1)}
          likePerformedFrom={'topic-detail'}
          onPressReply={onPressReply}
          style={styles.spacingTop}
        />
      }
    />
  );
}

type ResolvePostItemPropsParams = {
  postDetailContent: ReturnType<typeof postDetailContentHandler> | undefined;
  cachedTopic?: TopicFragment;
  username: string;
  channels: Array<Channel>;
};
const resolvePostItemProps = ({
  postDetailContent,
  cachedTopic,
  username,
  channels,
}: ResolvePostItemPropsParams):
  | {
      postItemProps: Omit<PostItemProps, 'topicId'>;
      postItemFooterProps: Omit<PostItemFooterProps, 'topicId' | 'postList'>;
    }
  | undefined => {
  if (postDetailContent?.firstPost) {
    const { topic, firstPost } = postDetailContent;
    const isCreator = firstPost?.username === username;
    return {
      postItemProps: {
        title: topic.title,
        content: firstPost.content,
        avatar: firstPost.avatar,
        channel: firstPost.channel,
        tags: topic.selectedTag,
        createdAt: firstPost.createdAt,
        username: firstPost.username,
        isLiked: firstPost.isLiked,
      },
      postItemFooterProps: {
        postId: firstPost.id,
        viewCount: topic.viewCount,
        likeCount: topic.likeCount,
        replyCount: topic.replyCount,
        isLiked: firstPost.isLiked,
        isCreator: isCreator,
        postNumber: firstPost.postNumber,
        frequentPosters: firstPost.freqPosters.slice(1),
      },
    };
  }
  if (cachedTopic) {
    const { topicId, ...post } = transformTopicToPost({
      ...cachedTopic,
      channels,
    });
    return {
      postItemProps: post,
      postItemFooterProps: {
        isLiked: post.isLiked,
        replyCount: 0,
        likeCount: 0,
        frequentPosters: [],
      },
    };
  }
};

const useStyles = makeStyles(({ spacing }) => ({
  spacingTop: {
    paddingTop: spacing.m,
  },
}));
let PostDetailHeaderItem = React.memo(BasePostDetailHeaderItem);

export { Props as PostDetailHeaderItemProps, PostDetailHeaderItem };
