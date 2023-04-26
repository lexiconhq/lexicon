import { FieldResolver, queryField } from 'nexus';

import {
  validateTopicDetailOptionalArgs,
  errorHandler,
  fetchTopicDetail,
  getTopicDetailBaseArgs,
} from '../../helpers';
import { Context } from '../../types';

// TODO: Move message detail handler from frontend to this endpoint #837
let privateMessageDetailQueryResolver: FieldResolver<
  'Query',
  'privateMessageDetail'
> = async (_, { topicId, postIds, postNumber }, { client }: Context) => {
  try {
    validateTopicDetailOptionalArgs({ postIds, postNumber });
    return await fetchTopicDetail({
      client,
      topicId,
      postIds,
      postNumber,
    });
  } catch (error) {
    throw errorHandler(error);
  }
};

/**
 * By specifying postNumber, Discourse API will return posts
 * with the following conditions:
 *  if total post < 20: all posts
 *  else if postNumber <= 5: the first 20 posts
 *  else if postNumber > total post - 20 + 5: 20 latest posts
 *  else if postNumber > 5: 20 posts starting from postNumber - 5
 * Note that 20 is the maximum post counts per fetch
 * and 5 is the value from Discourse
 */
let privateMessageDetailQuery = queryField('privateMessageDetail', {
  type: 'PrivateMessageDetailOutput',
  args: getTopicDetailBaseArgs(),
  resolve: privateMessageDetailQueryResolver,
});

export { privateMessageDetailQuery };
