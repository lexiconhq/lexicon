import { FieldResolver, mutationField, stringArg } from 'nexus';

import { Context } from '../../types';

export let logoutMutationResolver: FieldResolver<'Mutation', 'logout'> = async (
  _,
  { username },
  context: Context,
) => {
  try {
    await context.client.delete(`/session/${username}.json`);
    return 'success';
  } catch {
    return 'failed';
  }
};

export let logoutMutation = mutationField('logout', {
  type: 'String',
  args: {
    username: stringArg(),
  },
  resolve: logoutMutationResolver,
});
