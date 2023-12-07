import { FieldResolver, mutationField } from 'nexus';

import { ACCEPTED_LANGUAGE } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let deleteUserStatusMutation: FieldResolver<
  'Mutation',
  'deleteUserStatus'
> = async (_, _args, context: Context) => {
  try {
    const config = {
      headers: {
        'Accept-Language': ACCEPTED_LANGUAGE,
      },
    };
    await context.client.delete(`/user-status.json`, config);
    return 'success';
  } catch (e) {
    throw errorHandler(e);
  }
};

export let deleteUserStatus = mutationField('deleteUserStatus', {
  type: 'String',
  resolve: deleteUserStatusMutation,
});
