import { MutationHookOptions } from '@apollo/client';

import {
  ActivateAccountMutation as ActivateAccountType,
  ActivateAccountMutationVariables,
} from '../../generated/server';
import { ACTIVATE_ACCOUNT } from '../../graphql/server/auth';
import { useMutation } from '../../utils';

export function useActivateAccount(
  options?: MutationHookOptions<
    ActivateAccountType,
    ActivateAccountMutationVariables
  >,
) {
  const [activateAccount, { loading, error }] = useMutation<
    ActivateAccountType,
    ActivateAccountMutationVariables
  >(ACTIVATE_ACCOUNT, { ...options });

  return { activateAccount, loading, error };
}
