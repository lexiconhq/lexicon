import { MutationHookOptions } from '@apollo/client';

import {
  AuthenticateLoginLinkMutation as AuthenticateLoginLinkType,
  AuthenticateLoginLinkMutationVariables,
} from '../../generated/server';
import { AUTHENTICATE_LOGIN_LINK } from '../../graphql/server/auth';
import { useMutation } from '../../utils';

export function useAuthenticateLoginLink(
  options?: MutationHookOptions<
    AuthenticateLoginLinkType,
    AuthenticateLoginLinkMutationVariables
  >,
) {
  const [authenticateLoginLink, { loading, error }] = useMutation<
    AuthenticateLoginLinkType,
    AuthenticateLoginLinkMutationVariables
  >(AUTHENTICATE_LOGIN_LINK, {
    ...options,
  });

  return { authenticateLoginLink, loading, error };
}
