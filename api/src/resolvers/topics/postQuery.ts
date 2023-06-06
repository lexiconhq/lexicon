import { FieldResolver, queryField, intArg } from 'nexus';

import { errorHandler, fetchPost } from '../../helpers';
import { Context } from '../../types';

export let postQueryResolver: FieldResolver<'Query', 'post'> = async (
  _,
  { postId },
  { client }: Context,
) => {
  try {
    return await fetchPost({ client, postId });
  } catch (error) {
    throw errorHandler(error);
  }
};

let postQuery = queryField('post', {
  type: 'Post',
  args: {
    postId: intArg(),
  },
  resolve: postQueryResolver,
});

export { postQuery };
