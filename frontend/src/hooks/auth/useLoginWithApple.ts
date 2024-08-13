import { MutationHookOptions } from '@apollo/client';

import {
  LoginWithAppleMutation as LoginWithAppleType,
  LoginWithAppleMutationVariables,
} from '../../generated/server';
import { LOGIN_WITH_APPLE } from '../../graphql/server/auth';
import { useMutation } from '../../utils';

export function useLoginWithApple(
  options?: MutationHookOptions<
    LoginWithAppleType,
    LoginWithAppleMutationVariables
  >,
) {
  const [loginWithApple, { loading, error }] = useMutation<
    LoginWithAppleType,
    LoginWithAppleMutationVariables
  >(LOGIN_WITH_APPLE, {
    ...options,
  });

  return { loginWithApple, loading, error };
}
