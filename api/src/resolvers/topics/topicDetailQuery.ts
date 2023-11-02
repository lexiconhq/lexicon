import { FieldResolver, queryField, booleanArg, nullable } from 'nexus';

import { FIRST_POST_NUMBER, LIKE_ACTION_ID } from '../../constants';
import {
  validateTopicDetailOptionalArgs,
  errorHandler,
  fetchPost,
  fetchTopicDetail,
  getTopicDetailBaseArgs,
  formatPolls,
} from '../../helpers';
import { Context, Post } from '../../types';

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

    let formattedPosts = data.postStream.posts.map((post: Post) => {
      const { formattedPolls, formattedPollsVotes } = formatPolls(
        post.polls,
        post.pollsVotes,
      );

      return {
        ...post,
        polls: formattedPolls,
        pollsVotes: formattedPollsVotes,
      };
    });
    data.postStream.posts = formattedPosts;

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
      throw new Error('First post ID is not provided in topic stream');
    }
    const firstPostOfTopic = await fetchPost({ client, postId: firstPostId });
    data.postStream.firstPost = firstPostOfTopic;
    return data;
  } catch (error: unknown) {
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
