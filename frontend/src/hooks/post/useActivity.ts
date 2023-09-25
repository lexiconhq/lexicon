import { LazyQueryHookOptions, QueryHookOptions } from '@apollo/client';

import {
  UserActivityQuery as UserActivityType,
  UserActivityQueryVariables,
  UserActivityDocument,
} from '../../generated/server';
import { ErrorAlertOptionType } from '../../types';
import { useLazyQuery, useQuery } from '../../utils';

export function useActivity(
  options?: QueryHookOptions<UserActivityType, UserActivityQueryVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, networkStatus, refetch, fetchMore } = useQuery<
    UserActivityType,
    UserActivityQueryVariables
  >(
    UserActivityDocument,
    {
      ...options,
      fetchPolicy: 'network-only',
    },
    errorAlert,
  );

  return { data, loading, error, networkStatus, refetch, fetchMore };
}

export function useLazyActivity(
  options?: LazyQueryHookOptions<UserActivityType, UserActivityQueryVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [getActivity, { data, error }] = useLazyQuery<
    UserActivityType,
    UserActivityQueryVariables
  >(
    UserActivityDocument,
    {
      ...options,
    },
    errorAlert,
  );

  return { getActivity, data, error };
}
