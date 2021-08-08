import { FieldResolver, mutationField, stringArg } from '@nexus/schema';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let setPrimaryEmailResolver: FieldResolver<
  'Mutation',
  'setPrimaryEmail'
> = async (_, { username, selectedEmail }, context: Context) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const url = `users/${username}/preferences/primary-email.json`;
  try {
    let { data } = await context.client.put(
      url,
      JSON.stringify({ email: selectedEmail }),
      config,
    );
    if (data.success === 'OK') {
      return 'success';
    } else {
      return data.success;
    }
  } catch (e) {
    errorHandler(e);
  }
};

export let setPrimaryEmailMutation = mutationField('setPrimaryEmail', {
  type: 'String',
  args: {
    selectedEmail: stringArg({ required: true }),
    username: stringArg({ required: true }),
  },
  resolve: setPrimaryEmailResolver,
});
