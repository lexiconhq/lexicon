import { FieldResolver, mutationField, stringArg } from '@nexus/schema';

import { authenticate, getCsrfSession } from '../../helpers';

export let loginMutationResolver: FieldResolver<'Mutation', 'login'> = async (
  _,
  { email, password, secondFactorToken },
  __,
) => {
  try {
    let csrfSession = await getCsrfSession();
    return authenticate({
      ...csrfSession,
      login: email,
      password,
      secondFactorToken,
    });
  } catch (error) {
    throw new Error(`LoginError: ${error.message}`);
  }
};

export let loginMutation = mutationField('login', {
  type: 'LoginOutputUnion',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
    secondFactorToken: stringArg(),
  },
  resolve: loginMutationResolver,
});
