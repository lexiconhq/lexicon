import { stringify } from 'querystring';

import snakecaseKeys from 'snakecase-keys';
import {
  FieldResolver,
  mutationField,
  arg,
  intArg,
  stringArg,
  nullable,
} from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_FORM_URLENCODED } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let bookmarkPostResolver: FieldResolver<
  'Mutation',
  'bookmarkPost'
> = async (_, { postId }, context: Context) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_FORM_URLENCODED,
    },
  };
  let body = snakecaseKeys({ postId });
  try {
    let { data } = await context.client.post(
      `/bookmarks.json`,
      stringify(body),
      config,
    );
    return data;
  } catch (e) {
    errorHandler(e);
  }
};

export let bookmarkPostMutation = mutationField('bookmarkPost', {
  type: 'BookmarkOutput',
  args: {
    postId: intArg(),
    reminderType: nullable(arg({ type: 'BookmarkReminderEnum' })),
    reminderAt: nullable(stringArg()),
    name: nullable(stringArg()),
  },
  resolve: bookmarkPostResolver,
});
