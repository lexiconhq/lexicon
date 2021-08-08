import { stringify } from 'querystring';

import snakecaseKeys from 'snakecase-keys';
import {
  FieldResolver,
  mutationField,
  arg,
  intArg,
  stringArg,
} from '@nexus/schema';

import { CONTENT_FORM_URLENCODED } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let bookmarkPostResolver: FieldResolver<
  'Mutation',
  'bookmarkPost'
> = async (_, { postId }, context: Context) => {
  const config = {
    headers: {
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
    postId: intArg({ required: true }),
    reminderType: arg({ type: 'BookmarkReminderEnum' }),
    reminderAt: stringArg(),
    name: stringArg(),
  },
  resolve: bookmarkPostResolver,
});
