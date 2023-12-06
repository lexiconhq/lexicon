import { FieldResolver, mutationField, stringArg, nullable } from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let editUserStatusMutation: FieldResolver<
  'Mutation',
  'editUserStatus'
> = async (_, { endsAt, emoji, description }, context: Context) => {
  try {
    const editStatus = {
      description,
      emoji,
      ends_at: endsAt || '',
    };

    const config = {
      headers: {
        'Accept-Language': ACCEPTED_LANGUAGE,
        'Content-Type': CONTENT_JSON,
      },
    };
    await context.client.put(`/user-status.json`, editStatus, config);
    return 'success';
  } catch (e) {
    throw errorHandler(e);
  }
};

export let editUserStatus = mutationField('editUserStatus', {
  type: 'String',
  args: {
    endsAt: nullable(stringArg()),
    emoji: stringArg(),
    description: stringArg(),
  },
  resolve: editUserStatusMutation,
});
