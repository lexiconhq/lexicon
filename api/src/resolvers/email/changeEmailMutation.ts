import { FieldResolver, mutationField, stringArg } from '@nexus/schema';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let changeEmailResolver: FieldResolver<
  'Mutation',
  'changeEmail'
> = async (_, { username, newEmail }, context: Context) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const url = `users/${username}/preferences/email.json`;
  try {
    await context.client.put(url, JSON.stringify({ email: newEmail }), config);
    return 'success';
  } catch (e) {
    throw errorHandler(e);
  }
};

export let changeEmailMutation = mutationField('changeEmail', {
  type: 'String',
  args: {
    newEmail: stringArg({ required: true }),
    username: stringArg({ required: true }),
  },
  resolve: changeEmailResolver,
});
