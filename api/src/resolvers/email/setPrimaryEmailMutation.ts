import { FieldResolver, mutationField, stringArg } from 'nexus';

import { CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let setPrimaryEmailResolver: FieldResolver<
  'Mutation',
  'setPrimaryEmail'
> = async (_, { username, selectedEmail }, context: Context) => {
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
  };
  const url = `users/${username}/preferences/primary-email.json`;
  try {
    let { data } = await context.client.put(
      url,
      { email: selectedEmail },
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
    selectedEmail: stringArg(),
    username: stringArg(),
  },
  resolve: setPrimaryEmailResolver,
});
