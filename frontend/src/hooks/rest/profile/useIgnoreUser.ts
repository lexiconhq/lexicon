import { MutationHookOptions, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { ignoreUserBodyBuilder } from '../../../api/bodyBuilder';
import { IGNORE_USER } from '../../../api/discourse-apollo-rest/ignoreUser';
import {
  DISCOURSE_IGNORE_NOTIFICATION_LEVEL,
  DISCOURSE_REGULAR_NOTIFICATION_LEVEL,
  discourseIgnoreExpiringAt,
} from '../../../helpers/blockedUsers';

type IgnoreUserVariables = {
  username: string;
  ignoreUserInput: {
    notification_level: string;
    expiring_at?: string;
  };
  ignoreUserBodyBuilder: typeof ignoreUserBodyBuilder;
};

type IgnoreUserResult = {
  ignoreUser?: {
    success?: boolean | string;
  };
};

type IgnoreUserOptions = {
  silent?: boolean;
};

export function useIgnoreUser(
  options?: MutationHookOptions<IgnoreUserResult, IgnoreUserVariables> & {
    onUserError?: (error: { message: string }) => void;
  },
) {
  const { onUserError, ...mutationOptions } = options ?? {};

  const [ignoreUserMutation, { loading }] = useMutation<
    IgnoreUserResult,
    IgnoreUserVariables
  >(IGNORE_USER, mutationOptions);

  const reportError = useCallback(
    (error: unknown, silent?: boolean) => {
      if (silent) {
        return;
      }
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : t('Something unexpected happened. Please try again.');
      onUserError?.({ message });
    },
    [onUserError],
  );

  const ignoreUser = useCallback(
    async (username: string, callOptions?: IgnoreUserOptions) => {
      try {
        return await ignoreUserMutation({
          variables: {
            username,
            ignoreUserInput: {
              notification_level: DISCOURSE_IGNORE_NOTIFICATION_LEVEL,
              expiring_at: discourseIgnoreExpiringAt(),
            },
            ignoreUserBodyBuilder,
          },
        });
      } catch (error) {
        reportError(error, callOptions?.silent);
        throw error;
      }
    },
    [ignoreUserMutation, reportError],
  );

  const unignoreUser = useCallback(
    async (username: string, callOptions?: IgnoreUserOptions) => {
      try {
        return await ignoreUserMutation({
          variables: {
            username,
            ignoreUserInput: {
              notification_level: DISCOURSE_REGULAR_NOTIFICATION_LEVEL,
            },
            ignoreUserBodyBuilder,
          },
        });
      } catch (error) {
        reportError(error, callOptions?.silent);
        throw error;
      }
    },
    [ignoreUserMutation, reportError],
  );

  return { ignoreUser, unignoreUser, loading };
}
