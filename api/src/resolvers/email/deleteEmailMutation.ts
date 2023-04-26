import { FieldResolver, mutationField, stringArg } from 'nexus';

import { CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let deleteEmailResolver: FieldResolver<
  'Mutation',
  'deleteEmail'
> = async (_, { username, selectedEmail }, context: Context) => {
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
    data: {
      email: selectedEmail,
    },
  };
  const url = `users/${username}/preferences/email.json`;
  try {
    let { data } = await context.client.delete(url, config);
    if (data.success === 'OK') {
      return 'success';
    } else {
      return data.success;
    }
  } catch (e) {
    errorHandler(e);
  }
};

export let deleteEmailMutation = mutationField('deleteEmail', {
  type: 'String',
  args: {
    selectedEmail: stringArg(),
    username: stringArg(),
  },
  resolve: deleteEmailResolver,
});
