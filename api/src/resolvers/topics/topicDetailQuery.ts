/* eslint-disable @typescript-eslint/camelcase */
import camelcaseKey from 'camelcase-keys';
import { FieldResolver, queryField, intArg } from '@nexus/schema';

import { errorHandler, getTopicPostPath } from '../../helpers';
import { Context } from '../../types';

let topicDetailQueryResolver: FieldResolver<'Query', 'topicDetail'> = async (
  _,
  { topicId, posts, postPointer },
  context: Context,
) => {
  const config = {
    params: { post_ids: posts, include_raw: true },
  };

  try {
    let postPath = getTopicPostPath(posts, postPointer);
    let url = `/t/${topicId}${postPath}.json`;
    let { data: topicDetailResult } = await context.client.get(url, config);

    return camelcaseKey(topicDetailResult, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let topicDetailQuery = queryField('topicDetail', {
  type: 'TopicDetailOutput',
  args: {
    posts: intArg({ list: true }),
    topicId: intArg({ required: true }),
    postPointer: intArg(),
  },
  resolve: topicDetailQueryResolver,
});

export { topicDetailQuery };
