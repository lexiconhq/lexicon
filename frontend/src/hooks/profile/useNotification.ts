import { MutationHookOptions, QueryHookOptions } from '@apollo/client';

import {
  MarkRead as MarkReadType,
  MarkReadVariables,
  Notification as NotificationQueryType,
  NotificationVariables,
} from '../../generated/server/Notification';
import { MARK_READ, NOTIFICATION } from '../../graphql/server/notification';
import { useMutation, useQuery } from '../../utils';

export function useNotification(
  options?: QueryHookOptions<NotificationQueryType, NotificationVariables>,
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    NotificationQueryType,
    NotificationVariables
  >(NOTIFICATION, {
    ...options,
  });

  return { data, loading, error, refetch, fetchMore };
}

export function useMarkRead(
  options?: MutationHookOptions<MarkReadType, MarkReadVariables>,
) {
  const [markAsRead, { loading }] = useMutation<
    MarkReadType,
    MarkReadVariables
  >(MARK_READ, {
    ...options,
  });

  return { markAsRead, loading };
}
