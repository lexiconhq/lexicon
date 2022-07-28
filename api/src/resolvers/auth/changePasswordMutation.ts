import { FieldResolver, mutationField, stringArg } from '@nexus/schema';

import { CONTENT_JSON } from '../../constants';
import { errorHandler, getCsrfSession } from '../../helpers';
import { Context } from '../../types';

export let changePasswordResolver: FieldResolver<
  'Mutation',
  'changePassword'
> = async (_, { login }, context: Context) => {
  let headers = {
    'Content-Type': CONTENT_JSON,
  };
  if (!context.isAuth) {
    let { csrf, initialSessionCookie } = await getCsrfSession();
    Object.assign(headers, {
      'x-csrf-token': csrf,
      Cookie: initialSessionCookie,
    });
  }
  const config = {
    headers,
  };
  try {
    let { data } = await context.client.post(
      '/session/forgot_password.json',
      JSON.stringify({ login }),
      config,
    );
    if (!data.user_found) {
      throw new Error(`No account matches ${login}`);
    }
    return 'success';
  } catch (e) {
    throw errorHandler(e);
  }
};

export let changePasswordMutation = mutationField('changePassword', {
  type: 'String',
  args: {
    login: stringArg({ required: true }),
  },
  resolve: changePasswordResolver,
});
