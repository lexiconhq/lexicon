import { stringify } from 'querystring';

import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { FieldResolver, mutationField, arg, nullable } from 'nexus';

import { discourseClient } from '../../client';
import { CONTENT_FORM_URLENCODED } from '../../constants';
import { errorHandler, getCsrfSession, getHpChallenge } from '../../helpers';

export let registerMutationResolver: FieldResolver<
  'Mutation',
  'register'
> = async (_, { registerInput }, __) => {
  try {
    let csrfSession = await getCsrfSession();
    let { cookies, ...hpChallenge } = await getHpChallenge(csrfSession);
    const config = {
      headers: {
        withCredentials: true,
        Cookie: cookies,
        'x-csrf-token': csrfSession.csrf,
        'Content-Type': CONTENT_FORM_URLENCODED,
      },
    };
    let snakecaseBody = snakecaseKeys({ ...registerInput, ...hpChallenge });
    let { data } = await discourseClient.post(
      '/users.json',
      stringify(snakecaseBody),
      config,
    );

    if (data.user_id) {
      return camelcaseKeys(data, { deep: true });
    }
    return { success: false, message: `Registration is  unavailable.` };
  } catch (error) {
    errorHandler(error);
  }
};

export let registerMutation = mutationField('register', {
  type: 'RegisterOutput',
  args: {
    registerInput: nullable(arg({ type: 'RegisterInput' })),
  },
  resolve: registerMutationResolver,
});
