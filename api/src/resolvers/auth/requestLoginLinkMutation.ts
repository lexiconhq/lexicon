import { stringify } from 'querystring';

import { FieldResolver, mutationField, stringArg } from 'nexus';

import { errorHandler, getCsrfSession } from '../../helpers';
import { Context } from '../../types';
import { ACCEPTED_LANGUAGE, CONTENT_FORM_URLENCODED } from '../../constants';

export let requestLoginLinkMutationResolver: FieldResolver<
  'Mutation',
  'requestLoginLink'
> = async (_, { login }, { client }: Context) => {
  let { csrf, initialSessionCookie } = await getCsrfSession();
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_FORM_URLENCODED,
      'x-csrf-token': csrf,
    },
    withCredentials: true,
    Cookie: initialSessionCookie,
  };
  let body = {
    login,
  };

  try {
    let { data } = await client.post(`/u/email-login`, stringify(body), config);

    if (data.user_found) {
      return 'success';
    } else {
      throw new Error(`No account matches ${login}`);
    }
  } catch (e) {
    throw errorHandler(e);
  }
};

export let requestLoginLinkMutation = mutationField('requestLoginLink', {
  type: 'String',
  args: {
    login: stringArg(),
  },
  resolve: requestLoginLinkMutationResolver,
});
