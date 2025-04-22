import {
  ApolloError,
  DocumentNode,
  LazyQueryHookOptions,
  OperationVariables,
  QueryTuple,
  useLazyQuery as useLazyQueryBase,
} from '@apollo/client';
import { useIsFocused } from '@react-navigation/native';

import { errorHandlerAlert } from '../helpers';
import { ErrorAlertOptionType } from '../types';

export function useLazyQuery<TData, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: LazyQueryHookOptions<TData, TVariables> & {
    pollingEnabled?: boolean;
  },
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
): QueryTuple<TData, TVariables> {
  const isFocused = useIsFocused();

  const onErrorDefault = (error: ApolloError) => {
    errorHandlerAlert(error);
  };

  const {
    fetchPolicy = 'cache-and-network',
    pollingEnabled = false,
    ...others
  } = options ?? {};

  const {
    onError = errorAlert === 'SHOW_ALERT' ? onErrorDefault : undefined,
    nextFetchPolicy = fetchPolicy === 'cache-and-network'
      ? 'cache-first'
      : undefined,
    notifyOnNetworkStatusChange = fetchPolicy === 'network-only',
    pollInterval = pollingEnabled && isFocused ? 5000 : 0,
    ...otherOptions
  } = others;

  let [queryFunction, queryResult] = useLazyQueryBase<TData, TVariables>(
    query,
    {
      fetchPolicy,
      nextFetchPolicy,
      notifyOnNetworkStatusChange,
      pollInterval,
      onError,
      ...otherOptions,
    },
  );

  return [queryFunction, queryResult];
}
