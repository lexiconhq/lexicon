import { DEFAULT_CHANNEL } from '../constants';
import { ActionSummary as ActionsSummaryServer } from '../generated/server';
import { Channel, Post, Topic, TopicDetail, User } from '../types';

import { getImage } from './getUserImage';

export enum ActionsSummaryType {
  Bookmark = 1,
  Like = 2,
  FlagOffTopic = 3,
  FlagInappropriate = 4,
  SendMessage = 6,
  FlagSomethingElse = 7,
  FlagSpam = 8,
}

export type ActionsSummary = Omit<ActionsSummaryServer, '__typename'>;

export function ActionsSummaryHandler(
  actionsSummary: Array<ActionsSummary> | null,
) {
  let likeCount = 0;
  let isLiked = false;
  let canFlag = true;

  actionsSummary?.forEach(({ id, count, acted }) => {
    switch (id) {
      case ActionsSummaryType.Like: {
        likeCount = count ?? 0;
        isLiked = acted ?? false;
        break;
      }
      case ActionsSummaryType.FlagOffTopic:
      case ActionsSummaryType.FlagInappropriate:
      case ActionsSummaryType.FlagSomethingElse:
      case ActionsSummaryType.FlagSpam: {
        if (acted) {
          canFlag = false;
          break;
        }
      }
    }
  });

  return { isLiked, likeCount, canFlag };
}

type PostDetailContent = {
  topicDetailData: TopicDetail;
  channels?: Array<Channel> | null;
};

export function postDetailContentHandler({
  topicDetailData,
  channels,
}: PostDetailContent) {
  const channel = channels?.find(
    (channel) => channel.id === topicDetailData.categoryId,
  );

  let freqPosters: Array<User>;
  freqPosters = topicDetailData.details
    ? topicDetailData.details.participants.map(
        ({ id, username, avatar, name }) => ({
          id,
          username,
          avatar: getImage(avatar),
          name,
        }),
      )
    : [];

  const {
    id,
    title,
    postStream,
    details,
    postsCount,
    likeCount,
    views,
    tags,
    categoryId,
  } = topicDetailData;

  const topic: Topic = {
    id,
    title: title || 'Untitled',
    firstPostId: postStream?.stream ? postStream?.stream[0] : 0,
    canEditTopic: details?.canEdit ?? false,
    replyCount: postsCount ? postsCount - 1 : 0,
    likeCount: likeCount ?? 0,
    viewCount: views ?? 0,
    selectedTag: tags ?? [],
    selectedChannelId: categoryId ?? DEFAULT_CHANNEL.id,
  };

  const postComments: Array<Post> = [];
  let {
    stream,
    posts: basePostComments,
    firstPost: originalFirstPost,
  } = postStream;

  basePostComments.forEach((params) => {
    postComments.push(
      transformPostsToFrontendPost({ post: params, channel, freqPosters }),
    );
  });

  let firstPost;
  if (originalFirstPost) {
    firstPost = transformPostsToFrontendPost({
      post: originalFirstPost,
      channel,
      freqPosters,
    });
  }

  let firstLoadedCommentIndex = null;
  let lastLoadedCommentIndex = null;

  if (postComments.length && stream) {
    const [{ id: firstCommentId }] = postComments;
    firstLoadedCommentIndex = stream.findIndex(
      (postId) => postId === firstCommentId,
    );
    if (firstLoadedCommentIndex === -1) {
      firstLoadedCommentIndex = null;
    } else {
      lastLoadedCommentIndex =
        firstLoadedCommentIndex + (postComments.length - 1);
    }
  }

  return {
    stream,
    topic,
    postComments,
    firstPost,
    firstLoadedCommentIndex,
    lastLoadedCommentIndex,
  };
}

let transformPostsToFrontendPost = (params: {
  post: TopicDetail['postStream']['posts'][0];
  channel?: Channel;
  freqPosters: Array<User>;
}): Post => {
  let {
    actionsSummary,
    id,
    topicId,
    markdownContent,
    hidden,
    mentions,
    username,
    avatar,
    replyCount,
    createdAt,
    postNumber,
    replyToPostNumber,
    canEdit,
  } = params.post;
  if (!actionsSummary) {
    throw new Error('Unexpected condition: actionsSummary was undefined');
  }

  const { isLiked, likeCount, canFlag } = ActionsSummaryHandler(actionsSummary);
  return {
    id,
    topicId,
    title: '',
    content: markdownContent ?? '',
    hidden,
    mentionedUsers: mentions ?? undefined,
    username,
    avatar: getImage(avatar),
    replyCount: replyCount ?? 0,
    likeCount,
    viewCount: 0,
    isLiked,
    channel: params.channel ?? DEFAULT_CHANNEL,
    tags: [],
    createdAt,
    freqPosters: params.freqPosters,
    postNumber,
    replyToPostNumber,
    canEdit,
    canFlag,
  };
};
