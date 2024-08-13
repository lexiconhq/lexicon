import { FieldResolver, mutationField, stringArg } from 'nexus';

import {
  authenticateActivateAccount,
  getCsrfSession,
  getHpChallenge,
} from '../../helpers';
import { Context } from '../../types';

export let activateAccountMutationResolver: FieldResolver<
  'Mutation',
  'activateAccount'
> = async (_, { token }, { client }: Context) => {
  try {
    let csrfSession = await getCsrfSession();
    let { cookies, ...hpChallenge } = await getHpChallenge(csrfSession);

    return authenticateActivateAccount({
      initialSessionCookie: cookies,
      csrf: csrfSession.csrf,
      client,
      emailToken: token,
      ...hpChallenge,
    });
  } catch (unknownError) {
    const error = unknownError as Error;
    throw new Error(`activate-account: ${error.message}`);
  }
};

export let activateAccountMutation = mutationField('activateAccount', {
  type: 'LoginOutput',
  args: {
    token: stringArg(),
  },
  resolve: activateAccountMutationResolver,
});
