import { FieldResolver, queryField, intArg, list } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

import { postQueryResolver } from './postQuery';

let repliesQueryResolver: FieldResolver<'Query', 'replies'> = async (
  _,
  { postId },
  context: Context,
  info,
) => {
  try {
    let url = `/posts/${postId}/replies.json`;
    let { data: postReplies } = await context.client.get(url);
    let posts = [];
    for (let postReply of postReplies) {
      // They actually have data here but without raw and we can't use 'include_raw: true' so we fetch it again with post.
      // If they have many replies this will make it slower.
      let post = await postQueryResolver(
        _,
        { postId: postReply.id },
        context,
        info,
      );
      posts.push(post);
    }
    return posts;
  } catch (error) {
    throw errorHandler(error);
  }
};

let repliesQuery = queryField('replies', {
  type: list('Post'),
  args: {
    postId: intArg(),
  },
  resolve: repliesQueryResolver,
});

export { repliesQuery };
