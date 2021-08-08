import { LazyQueryHookOptions, QueryHookOptions } from '@apollo/client';

import {
  UserActivity as UserActivityType,
  UserActivityVariables,
} from '../../generated/server/UserActivity';
import { USER_ACTIVITY } from '../../graphql/server/userActivity';
import { ErrorAlertOptionType } from '../../types';
import { useLazyQuery, useQuery } from '../../utils';

export function useActivity(
  options?: QueryHookOptions<UserActivityType, UserActivityVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, networkStatus, refetch, fetchMore } = useQuery<
    UserActivityType,
    UserActivityVariables
  >(
    USER_ACTIVITY,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error, networkStatus, refetch, fetchMore };
}

export function useLazyActivity(
  options?: LazyQueryHookOptions<UserActivityType, UserActivityVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [getActivity, { data, error }] = useLazyQuery<
    UserActivityType,
    UserActivityVariables
  >(
    USER_ACTIVITY,
    {
      ...options,
    },
    errorAlert,
  );

  return { getActivity, data, error };
}
