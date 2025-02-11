import { RestLink } from 'apollo-link-rest';

import { FIRST_POST_NUMBER, LIKE_ACTION_ID } from '../../constants';
import { Participant } from '../../generatedAPI/server';
import { Post } from '../../types/api';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

import { generatePostPatcher } from './helper/Post';

export const topicDetailOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
  _,
  _d,
  context,
) => {
  const { includeFirstPost } = context.resolverParams.args;
  let formattedPosts = data.postStream.posts.map((post: Post) => {
    return generatePostPatcher(post);
  });
  data.postStream.posts = formattedPosts;

  if (data.details?.participants) {
    data.details.participants = data.details.participants?.map(
      (participant: Participant) => {
        return {
          ...participant,
          avatarTemplate: getNormalizedUrlTemplate({ instance: participant }),
        };
      },
    );
  }

  const firstPostOfData = data.postStream.posts[0];
  if (firstPostOfData) {
    let isLiked = !!firstPostOfData.actionsSummary.find(
      ({ id }: { id: number }) => {
        return id === LIKE_ACTION_ID;
      },
    )?.acted;
    data.liked = isLiked;
  }

  if (firstPostOfData.postNumber === FIRST_POST_NUMBER) {
    data.postStream.posts = data.postStream.posts.slice(1);
    if (includeFirstPost) {
      data.postStream.firstPost = firstPostOfData;
    }
    return { ...data, __typename: 'TopicDetailOutput' };
  }

  return {
    ...data,
    __typename: 'TopicDetailOutput',
  };
};
