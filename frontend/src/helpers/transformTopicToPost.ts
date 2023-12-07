import { NO_EXCERPT_WORDING } from '../constants';
import { TopicsQuery } from '../generated/server';
import { Channel, PostWithoutId, User } from '../types';

import { findChannelByCategoryId } from './findChannelByCategoryId';
import { getImage } from './getUserImage';

type Topic = NonNullable<
  NonNullable<TopicsQuery['topics']['topicList']>['topics']
>[0];

type Params = Topic & { channels?: Array<Channel> };

/**
 * Transforming topic type from our graphql response
 * to a Post type that we usually based our component props on
 */
let transformTopicToPost = ({
  posters,
  id,
  title,
  excerpt,
  visible,
  authorUserId,
  pinned,
  liked,
  likeCount,
  postsCount,
  tags,
  bumpedAt: createdAt,
  views,
  categoryId,
  channels,
  imageUrl,
}: Params): PostWithoutId => {
  const author = posters.find((poster) => {
    return 'userId' in poster && poster.userId === authorUserId;
  });

  const frequentUserArray: Array<User> = [];
  posters.forEach((poster) => {
    if ('user' in poster && poster.user) {
      const { user } = poster;
      frequentUserArray.push({
        id: user.id,
        username: user.username,
        avatar: getImage(user.avatar),
      });
    }
  });

  const channel = findChannelByCategoryId({
    categoryId,
    channels,
  });

  const authorUser =
    // eslint-disable-next-line no-underscore-dangle
    author?.__typename === 'TopicPoster' ? author.user : undefined;

  return {
    topicId: id,
    title,
    content: excerpt || NO_EXCERPT_WORDING,
    hidden: !visible,
    username: authorUser?.username ?? '',
    avatar: authorUser ? getImage(authorUser.avatar) : '',
    pinned,
    replyCount: postsCount - 1,
    likeCount,
    viewCount: views,
    isLiked: liked || false,
    channel: channel,
    tags: tags || [],
    createdAt,
    freqPosters: frequentUserArray,
    imageUrls: imageUrl ? [imageUrl] : undefined,
  };
};

export { transformTopicToPost };
