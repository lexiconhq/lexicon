import {
  ApolloError,
  DocumentNode,
  LazyQueryHookOptions,
  OperationVariables,
  QueryTuple,
  useLazyQuery as useLazyQueryBase,
} from '@apollo/client';

import { errorHandlerAlert } from '../helpers';
import { ErrorAlertOptionType } from '../types';

export function useLazyQuery<TData, TVariables extends OperationVariables>(
  query: DocumentNode,
  options?: LazyQueryHookOptions<TData, TVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
): QueryTuple<TData, TVariables> {
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

  let [queryFunction, queryResult] = useLazyQueryBase<TData, TVariables>(
    query,
    {
      fetchPolicy,
      nextFetchPolicy,
      notifyOnNetworkStatusChange,
      onError,
      ...otherOptions,
    },
  );

  return [queryFunction, queryResult];
}
