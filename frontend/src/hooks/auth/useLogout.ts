import { MutationHookOptions } from '@apollo/client';

import {
  LogoutMutation as LogoutType,
  LogoutMutationVariables,
} from '../../generated/server';
import { LOGOUT } from '../../graphql/server/auth';
import { useMutation } from '../../utils';
import { getExpoPushTokenHandler } from '../../helpers';

export function useLogout(
  options?: MutationHookOptions<LogoutType, LogoutMutationVariables>,
) {
  const [mutate, { loading }] = useMutation<
    LogoutType,
    LogoutMutationVariables
  >(LOGOUT, { ...options });

  const logout = async ({ username }: { username: string }) => {
    const { token } = await getExpoPushTokenHandler();

    mutate({
      variables: {
        pushNotificationsToken: token,
        username,
      },
    });
  };
  return { logout, loading };
}
