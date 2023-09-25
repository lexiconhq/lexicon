import { FieldResolver, queryField, intArg } from 'nexus';

import {
  errorHandler,
  generateMarkdownContent,
  getMention,
} from '../../helpers';
import { Context } from '../../types';
import { ACCEPTED_LANGUAGE } from '../../constants';

export const postRawQueryResolver: FieldResolver<'Query', 'postRaw'> = async (
  _,
  { postId },
  context: Context,
) => {
  const config = {
    headers: { 'Accept-Language': ACCEPTED_LANGUAGE },
    params: { include_raw: true },
  };

  try {
    const urlRaw = `/posts/${postId}/raw.json`;
    const urlCooked = `/posts/${postId}/cooked.json`;

    let { data: raw } = await context.client.get(urlRaw, config);
    let {
      data: { cooked },
    } = await context.client.get(urlCooked);

    const markdownContent = generateMarkdownContent(raw, cooked);
    const mentions = getMention(cooked) ?? [];
    return { raw, markdownContent, mentions };
  } catch (error) {
    throw errorHandler(error);
  }
};

export const postRawQuery = queryField('postRaw', {
  type: 'PostRaw',
  args: { postId: intArg() },
  resolve: postRawQueryResolver,
});
