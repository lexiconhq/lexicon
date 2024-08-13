import { FieldResolver, mutationField, stringArg } from 'nexus';

import { authenticateApple, getCsrfSession } from '../../helpers';
import { Context } from '../../types';

export let loginWithAppleMutationResolver: FieldResolver<
  'Mutation',
  'loginWithApple'
> = async (_, { identityToken }, { client }: Context) => {
  let csrfSession = await getCsrfSession();
  return authenticateApple({
    ...csrfSession,
    identityToken,
    client,
  });
};

export let loginWithAppleMutation = mutationField('loginWithApple', {
  type: 'LoginOutput',
  args: {
    identityToken: stringArg(),
  },
  resolve: loginWithAppleMutationResolver,
});
