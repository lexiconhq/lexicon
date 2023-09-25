import { MutationHookOptions } from '@apollo/client';

import {
  LoginMutation as LoginType,
  LoginMutationVariables,
} from '../../generated/server';
import { LOGIN } from '../../graphql/server/auth';
import { useMutation } from '../../utils';

export function useLogin(
  options?: MutationHookOptions<LoginType, LoginMutationVariables>,
) {
  const [login, { loading, error }] = useMutation<
    LoginType,
    LoginMutationVariables
  >(LOGIN, {
    ...options,
  });

  return { login, loading, error };
}
