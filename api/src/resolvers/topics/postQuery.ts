import { FieldResolver, queryField, intArg } from 'nexus';

import { errorHandler, fetchPost, formatPolls } from '../../helpers';
import { Context } from '../../types';

export let postQueryResolver: FieldResolver<'Query', 'post'> = async (
  _,
  { postId },
  { client }: Context,
) => {
  try {
    const data = await fetchPost({ client, postId });
    const { formattedPolls, formattedPollsVotes } = formatPolls(
      data.polls,
      data.pollsVotes,
    );

    return {
      ...data,
      polls: formattedPolls,
      pollsVotes: formattedPollsVotes,
    };
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
