import { QueryHookOptions } from '@apollo/client';

import {
  UserActivityDocument,
  UserActivityQueryVariables,
  UserActivityQuery as UserActivityType,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useQuery } from '../../../utils';

export function useActivity(
  options?: QueryHookOptions<UserActivityType, UserActivityQueryVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  let variables = options && options.variables;

  if (variables && !options?.variables?.filter) {
    variables = { ...variables, filter: '1,4,5' };
  }

  const { data, loading, error, networkStatus, refetch, fetchMore } = useQuery<
    UserActivityType,
    UserActivityQueryVariables
  >(
    UserActivityDocument,
    {
      ...options,
      fetchPolicy: 'network-only',
      variables,
    },
    errorAlert,
  );

  return {
    data,
    loading,
    error,
    networkStatus,
    refetch,
    fetchMore,
  };
}
