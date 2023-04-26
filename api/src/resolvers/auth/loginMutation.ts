import { FieldResolver, mutationField, nullable, stringArg } from 'nexus';

import { authenticate, getCsrfSession } from '../../helpers';
import { Context } from '../../types';

export let loginMutationResolver: FieldResolver<'Mutation', 'login'> = async (
  _,
  { email, password, secondFactorToken },
  { client }: Context,
) => {
  try {
    let csrfSession = await getCsrfSession();
    return authenticate({
      ...csrfSession,
      login: email,
      password,
      secondFactorToken,
      client,
    });
  } catch (unknownError) {
    const error = unknownError as Error;
    throw new Error(`LoginError: ${error.message}`);
  }
};

export let loginMutation = mutationField('login', {
  type: 'LoginOutputUnion',
  args: {
    email: stringArg(),
    password: stringArg(),

    // 2FA must be enabled individually by each user, so it must be nullable.
    secondFactorToken: nullable(stringArg()),
  },
  resolve: loginMutationResolver,
});
