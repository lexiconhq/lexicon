import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, arg, intArg } from '@nexus/schema';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let editPostResolver: FieldResolver<'Mutation', 'editPost'> = async (
  _,
  { postId, postInput },
  context: Context,
) => {
  let post = snakecaseKey(postInput);
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    let { data } = await context.client.put(
      `/posts/${postId}.json`,
      JSON.stringify({ post }),
      config,
    );
    return camelcaseKey(data.post, { deep: true });
  } catch (e) {
    errorHandler(e);
  }
};

export let editPostMutation = mutationField('editPost', {
  type: 'Post',
  args: {
    postId: intArg({ required: true }),
    postInput: arg({ type: 'EditPostInput', required: true }),
  },
  resolve: editPostResolver,
});
