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

  const logout = async ({
    username,
    enableLexiconPushNotifications,
  }: {
    username: string;
    enableLexiconPushNotifications: boolean;
  }) => {
    let pushNotificationsToken = undefined;
    if (enableLexiconPushNotifications) {
      const { token } = await getExpoPushTokenHandler();
      pushNotificationsToken = token;
    }

    mutate({
      variables: {
        pushNotificationsToken,
        username,
      },
    });
  };
  return { logout, loading };
}
