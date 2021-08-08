import camelcaseKey from 'camelcase-keys';
import { FieldResolver, queryField, intArg } from '@nexus/schema';

import { errorHandler, getMention, getPostImageUrl } from '../../helpers';
import { Context } from '../../types';

export const postRawQueryResolver: FieldResolver<'Query', 'postRaw'> = async (
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
    const urlRaw = `/posts/${postId}/raw.json`;
    const urlCooked = `/posts/${postId}/cooked.json`;

    let { data: raw } = await context.client.get(urlRaw, config);
    let {
      data: { cooked },
    } = await context.client.get(urlCooked);

    let listOfCooked = getPostImageUrl(cooked) ?? [];
    let listOfMention = getMention(cooked) ?? [];

    let postResult = { raw, listOfCooked, listOfMention };

    return camelcaseKey(postResult, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

export const postRawQuery = queryField('postRaw', {
  type: 'PostRaw',
  args: { postId: intArg({ required: true }) },
  resolve: postRawQueryResolver,
});
