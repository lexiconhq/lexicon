import { OperationVariables, useFragment_experimental } from '@apollo/client';
import React from 'react';

import {
  PostFragment,
  PostFragmentDoc,
  TopicFragment,
  TopicFragmentDoc,
} from '../../generatedAPI/server';
import {
  getImage,
  postDetailContentHandler,
  transformPostsToFrontendPost,
  transformTopicToPost,
  useStorage,
} from '../../helpers';
import { makeStyles } from '../../theme';
import { Channel } from '../../types';
import { MetricsProp } from '../Metrics/Metrics';

import { PostItem, PostItemProps } from './PostItem';
import { PostItemFooter, PostItemFooterProps } from './PostItemFooter';

type Props = Required<
  Pick<
    PostItemProps,
    'isHidden' | 'mentionedUsers' | 'onPressViewIgnoredContent'
  >
> &
  Pick<PostItemProps, 'polls' | 'postId' | 'pollsVotes'> &
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
    polls,
    postId,
    pollsVotes,
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
  const cacheFirstPostResult = useFragment_experimental<
    PostFragment,
    OperationVariables
  >({
    fragment: PostFragmentDoc,
    fragmentName: 'PostFragment',
    from: {
      __typename: 'Post',
      id: postId,
    },
  });
  const cachedTopic = cacheTopicResult.data;
  const cachedFirstPost = cacheFirstPostResult.data;
  const username = storage.getItem('user')?.username ?? '';
  let channels = storage.getItem('channels') ?? [];

  const resolvedPostItemPropsResult = resolvePostItemProps({
    postDetailContent,
    cachedTopic,
    username,
    channels,
    cachedFirstPost,
  });

  if (!resolvedPostItemPropsResult) {
    throw new Error('Post not found');
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
      showStatus
      emojiCode={postItemProps.emojiCode}
      polls={polls}
      pollsVotes={pollsVotes}
      postId={postId}
      testIDStatus="PostDetailHeaderItem:Author:EmojiStatus"
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
  cachedFirstPost?: PostFragment;
};
const resolvePostItemProps = ({
  postDetailContent,
  cachedTopic,
  username,
  channels,
  cachedFirstPost,
}: ResolvePostItemPropsParams):
  | {
      postItemProps: Omit<PostItemProps, 'topicId'>;
      postItemFooterProps: Omit<PostItemFooterProps, 'topicId' | 'postList'>;
    }
  | undefined => {
  if (!postDetailContent && !cachedTopic) {
    return;
  }

  if (postDetailContent) {
    let { topic, firstPost } = postDetailContent;
    if (!firstPost && cachedFirstPost?.id) {
      let freqPosters = cachedTopic?.posters
        ? cachedTopic.posters.map(({ user }) => ({
            id: user.id,
            username: user.username,
            avatar: getImage(user.avatar),
            name: user.name,
          }))
        : [];
      const channel = channels?.find(
        (channel) => channel.id === cachedTopic?.categoryId,
      );
      const formattedFirstPost = transformPostsToFrontendPost({
        post: cachedFirstPost,
        channel,
        freqPosters,
      });
      firstPost = formattedFirstPost;
    }

    if (firstPost) {
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
          emojiCode: firstPost.emojiStatus,
          postId: firstPost.id,
        },
        postItemFooterProps: {
          postId: firstPost.id,
          viewCount: topic.viewCount,
          likeCount: firstPost.likeCount,
          replyCount: topic.replyCount,
          isLiked: firstPost.isLiked,
          isCreator: isCreator,
          postNumber: firstPost.postNumber,
          frequentPosters: firstPost.freqPosters.slice(1),
        },
      };
    }
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

export { PostDetailHeaderItem, Props as PostDetailHeaderItemProps };
