import { MutationHookOptions, QueryHookOptions } from '@apollo/client';

import {
  MarkReadMutation as MarkReadType,
  MarkReadMutationVariables,
  MarkReadDocument,
  NotificationQuery as NotificationQueryType,
  NotificationQueryVariables,
  NotificationDocument,
} from '../../generated/server';
import { useMutation, useQuery } from '../../utils';

export function useNotification(
  options?: QueryHookOptions<NotificationQueryType, NotificationQueryVariables>,
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    NotificationQueryType,
    NotificationQueryVariables
  >(NotificationDocument, {
    ...options,
  });

  return { data, loading, error, refetch, fetchMore };
}

export function useMarkRead(
  options?: MutationHookOptions<MarkReadType, MarkReadMutationVariables>,
) {
  const [markAsRead, { loading }] = useMutation<
    MarkReadType,
    MarkReadMutationVariables
  >(MarkReadDocument, {
    ...options,
  });

  return { markAsRead, loading };
}
