import { MutationHookOptions } from '@apollo/client';

import {
  Logout as LogoutType,
  LogoutVariables,
} from '../../generated/server/Logout';
import { LOGOUT } from '../../graphql/server/auth';
import { useMutation } from '../../utils';

export function useLogout(
  options?: MutationHookOptions<LogoutType, LogoutVariables>,
) {
  const [logout, { loading }] = useMutation<LogoutType, LogoutVariables>(
    LOGOUT,
    { ...options },
  );

  return { logout, loading };
}
