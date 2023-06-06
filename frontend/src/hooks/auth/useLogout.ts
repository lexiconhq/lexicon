import { MutationHookOptions } from '@apollo/client';

import {
  LogoutMutation as LogoutType,
  LogoutMutationVariables,
} from '../../generated/server';
import { LOGOUT } from '../../graphql/server/auth';
import { useMutation } from '../../utils';

export function useLogout(
  options?: MutationHookOptions<LogoutType, LogoutMutationVariables>,
) {
  const [logout, { loading }] = useMutation<
    LogoutType,
    LogoutMutationVariables
  >(LOGOUT, { ...options });

  return { logout, loading };
}
