import { FieldResolver, queryField, booleanArg, nullable } from 'nexus';
import axios from 'axios';

import {
  FIRST_POST_NUMBER,
  LIKE_ACTION_ID,
  privateTopic,
} from '../../constants';
import {
  validateTopicDetailOptionalArgs,
  errorHandler,
  fetchPost,
  fetchTopicDetail,
  getTopicDetailBaseArgs,
} from '../../helpers';
import { Context } from '../../types';

let topicDetailQueryResolver: FieldResolver<'Query', 'topicDetail'> = async (
  _,
  { topicId, postIds, postNumber, includeFirstPost },
  { client }: Context,
) => {
  try {
    validateTopicDetailOptionalArgs({ postIds, postNumber, includeFirstPost });
    const data = await fetchTopicDetail({
      client,
      topicId,
      postIds,
      postNumber,
    });
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
      return data;
    }

    if (!includeFirstPost) {
      return data;
    }

    const firstPostId = data.postStream.stream?.[0];
    if (!firstPostId) {
      throw new Error('First post ID is not provided in topic stream.');
    }
    const firstPostOfTopic = await fetchPost({ client, postId: firstPostId });
    data.postStream.firstPost = firstPostOfTopic;
    return data;
  } catch (error: unknown) {
    /**
     * This condition is implemented to throw a specific error in the topic when a user receives a 403 error,
     * indicating that the user does not have access to open the topic due to its private status.
     */

    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error(privateTopic);
    }
    throw errorHandler(error);
  }
};

/**
 * By specifying postNumber, Discourse API will return posts
 * with the following conditions:
 *  if total post <= 20: all posts
 *  else if postNumber <= 5: the first 20 posts
 *  else if postNumber > total post - 20 + 5: 20 latest posts
 *  else if postNumber > 5: 20 posts starting from postNumber - 5
 * Note that 20 is the maximum post counts per fetch
 * and 5 is the value from Discourse
 */
let topicDetailQuery = queryField('topicDetail', {
  type: 'TopicDetailOutput',
  args: {
    ...getTopicDetailBaseArgs(),
    includeFirstPost: nullable(booleanArg()),
  },
  resolve: topicDetailQueryResolver,
});

export { topicDetailQuery };
