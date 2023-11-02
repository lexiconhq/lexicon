import camelcaseKey from 'camelcase-keys';
import snakecaseKey from 'snakecase-keys';
import { FieldResolver, mutationField, arg, intArg } from 'nexus';

import { errorHandler, formatPolls } from '../../helpers';
import { Context } from '../../types';
import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';

export let editPostResolver: FieldResolver<'Mutation', 'editPost'> = async (
  _,
  { postId, postInput },
  context: Context,
) => {
  let post = snakecaseKey(postInput);
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    let { data } = await context.client.put(
      `/posts/${postId}.json`,
      { post },
      config,
    );

    let editPostData = camelcaseKey(data.post, { deep: true });
    const { formattedPolls, formattedPollsVotes } = formatPolls(
      editPostData.polls,
      editPostData.pollsVotes,
    );

    return {
      ...editPostData,
      polls: formattedPolls,
      pollsVotes: formattedPollsVotes,
    };
  } catch (e) {
    errorHandler(e);
  }
};

export let editPostMutation = mutationField('editPost', {
  type: 'Post',
  args: {
    postId: intArg(),
    postInput: arg({ type: 'EditPostInput' }),
  },
  resolve: editPostResolver,
});
