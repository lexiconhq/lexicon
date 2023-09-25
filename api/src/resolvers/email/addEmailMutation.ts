import { stringify } from 'querystring';

import { FieldResolver, mutationField, stringArg } from 'nexus';

import { CONTENT_FORM_URLENCODED } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let addEmailMutation: FieldResolver<'Mutation', 'addEmail'> = async (
  _,
  { email, username },
  context: Context,
) => {
  let body = {
    email,
  };
  const config = {
    headers: {
      'Content-Type': CONTENT_FORM_URLENCODED,
    },
  };
  try {
    await context.client.post(
      `/u/${username}/preferences/email.json`,
      stringify(body),
      config,
    );
    return 'success';
  } catch (e) {
    throw errorHandler(e);
  }
};

export let addEmail = mutationField('addEmail', {
  type: 'String',
  args: {
    email: stringArg(),
    username: stringArg(),
  },
  resolve: addEmailMutation,
});
