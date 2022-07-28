import { MutationHookOptions } from '@apollo/client';

import {
  Login as LoginType,
  LoginVariables,
} from '../../generated/server/Auth';
import { LOGIN } from '../../graphql/server/auth';
import { useMutation } from '../../utils';

export function useLogin(
  options?: MutationHookOptions<LoginType, LoginVariables>,
) {
  const [login, { loading, error }] = useMutation<LoginType, LoginVariables>(
    LOGIN,
    {
      ...options,
    },
  );

  return { login, loading, error };
}
