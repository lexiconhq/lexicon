import { MutationHookOptions, QueryHookOptions } from '@apollo/client';

import { notificationsPathBuilder } from '../../../api/pathBuilder';
import {
  MarkReadDocument,
  MarkReadMutationVariables,
  MarkReadMutation as MarkReadType,
  NotificationDocument,
  NotificationQuery as NotificationQueryType,
  NotificationQueryVariables,
} from '../../../generatedAPI/server';
import { useMutation, useQuery } from '../../../utils';

export function useNotification(
  options?: QueryHookOptions<NotificationQueryType, NotificationQueryVariables>,
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    NotificationQueryType,
    NotificationQueryVariables
  >(NotificationDocument, {
    ...options,

    variables: {
      notificationsPath: notificationsPathBuilder,
      page: options?.variables?.page ?? 1,
      ...options?.variables,
    },
  });

  return { data, loading, error, refetch, fetchMore };
}

export function useMarkRead(
  options?: MutationHookOptions<MarkReadType, MarkReadMutationVariables>,
) {
  const [markAsReadMutationFunc, { loading }] = useMutation<
    MarkReadType,
    MarkReadMutationVariables
  >(MarkReadDocument, {
    ...options,
  });

  /**
   * Marks notifications as read.
   * If no input is provided, all notifications will be marked as read in Discourse.
   * If a specific notification should be marked as read, its ID must be included in the input.
   */
  const markAsRead = (args?: { variables?: MarkReadMutationVariables }) => {
    return markAsReadMutationFunc({
      ...args,
      variables: {
        markReadInput: {
          id: args?.variables?.markReadInput?.id || undefined,
        },
      },
    });
  };
  return { markAsRead, loading };
}
