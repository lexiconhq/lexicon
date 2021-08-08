import camelcaseKey from 'camelcase-keys';
import { FieldResolver, queryField, intArg } from '@nexus/schema';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let postQueryResolver: FieldResolver<'Query', 'post'> = async (
  _,
  { postId },
  context: Context,
) => {
  const config = {
    params: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      include_raw: true,
    },
  };
  try {
    let url = `/posts/${postId}.json`;
    let { data: postResult } = await context.client.get(url, config);

    return camelcaseKey(postResult, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let postQuery = queryField('post', {
  type: 'Post',
  args: {
    postId: intArg({ required: true }),
  },
  resolve: postQueryResolver,
});

export { postQuery };
