import { FieldResolver, mutationField, stringArg } from 'nexus';

import { authenticateLoginLink, getCsrfSession } from '../../helpers';
import { Context } from '../../types';

export let authenticateLoginLinkMutationResolver: FieldResolver<
  'Mutation',
  'authenticateLoginLink'
> = async (_, { token }, { client }: Context) => {
  try {
    let csrfSession = await getCsrfSession();
    return authenticateLoginLink({
      ...csrfSession,
      emailToken: token,
      client,
    });
  } catch (unknownError) {
    const error = unknownError as Error;
    throw new Error(`LoginError: ${error.message}`);
  }
};

export let authenticateLoginLinkMutation = mutationField(
  'authenticateLoginLink',
  {
    type: 'LoginOutput',
    args: {
      token: stringArg(),
    },
    resolve: authenticateLoginLinkMutationResolver,
  },
);
