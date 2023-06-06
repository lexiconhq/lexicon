import {
  ApolloError,
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  useQuery as useQueryBase,
} from '@apollo/client';

import { errorHandlerAlert } from '../helpers';
import { ErrorAlertOptionType } from '../types';

export function useQuery<TData, TVariables extends OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
): QueryResult<TData, TVariables> {
  const onErrorDefault = (error: ApolloError) => {
    errorHandlerAlert(error);
  };

  const { fetchPolicy = 'cache-and-network', ...others } = options ?? {};

  const {
    onError = errorAlert === 'SHOW_ALERT' ? onErrorDefault : undefined,
    nextFetchPolicy = fetchPolicy === 'cache-and-network'
      ? 'cache-first'
      : undefined,
    notifyOnNetworkStatusChange = fetchPolicy === 'network-only',
    ...otherOptions
  } = others;

  let queryResult = useQueryBase<TData, TVariables>(query, {
    fetchPolicy,
    nextFetchPolicy,
    notifyOnNetworkStatusChange,
    onError,
    ...otherOptions,
  });

  return queryResult;
}
