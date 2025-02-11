import { MutationHookOptions } from '@apollo/client';

import {
  LogoutDocument,
  LogoutMutationVariables,
  LogoutMutation as LogoutType,
} from '../../../generatedAPI/server';
import { getExpoPushTokenHandler } from '../../../helpers';
import { useMutation } from '../../../utils';

export function useLogout(
  options?: MutationHookOptions<LogoutType, LogoutMutationVariables>,
) {
  const [mutate, { loading }] = useMutation<
    LogoutType,
    LogoutMutationVariables
  >(LogoutDocument, { ...options });

  const logout = async ({
    enableLexiconPushNotifications,
  }: {
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
      },
    });
  };
  return { logout, loading };
}
