import { DEFAULT_CHANNEL } from '../constants';
import { ActionSummary as ActionsSummaryServer } from '../generated/server/types';
import { Channel, Post, Topic, TopicDetail, User } from '../types';

import { getImage } from './getUserImage';

enum ActionsSummaryType {
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
        likeCount = count || 0;
        isLiked = acted || false;
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
    canEditTopic: details?.canEdit || false,
    replyCount: postsCount ? postsCount - 1 : 0,
    likeCount: likeCount ? likeCount : 0,
    viewCount: views || 0,
    selectedTag: tags || [],
    selectedChanelId: categoryId || 1,
  };

  const posts: Array<Post> = [];
  let { posts: basePosts, stream } = postStream;

  basePosts.forEach(
    ({
      actionsSummary,
      id,
      topicId,
      raw,
      hidden,
      listOfCooked,
      listOfMention,
      username,
      avatar,
      replyCount,
      createdAt,
      postNumber,
      replyToPostNumber,
      canEdit,
    }) => {
      if (!actionsSummary) {
        throw new Error('Unexpected condition: actionsSummary was undefined');
      }

      const { isLiked, likeCount, canFlag } =
        ActionsSummaryHandler(actionsSummary);

      posts.push({
        id,
        topicId,
        title: '',
        content: raw || '',
        hidden,
        images: listOfCooked || undefined,
        mentionedUsers: listOfMention || undefined,
        username,
        avatar: getImage(avatar),
        replyCount: replyCount || 0,
        likeCount,
        viewCount: 0,
        isLiked,
        channel: channel || DEFAULT_CHANNEL,
        tags: [],
        createdAt,
        freqPosters,
        postNumber,
        replyToPostNumber: replyToPostNumber || -1,
        canEdit,
        canFlag,
      });
    },
  );

  const firstPostIndex =
    stream?.findIndex((postId) => postId === posts[0].id) || 0;
  const lastPostIndex = firstPostIndex + (posts.length - 1);

  return {
    stream,
    topic,
    posts,
    firstPostIndex,
    lastPostIndex,
  };
}
