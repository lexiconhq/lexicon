import {
  ApolloError,
  DocumentNode,
  MutationHookOptions,
  MutationTuple,
  OperationVariables,
  useMutation as useMutationBase,
} from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import { errorHandlerAlert } from '../helpers';
import { ErrorAlertOptionType, TabNavProp } from '../types';

export function useMutation<TData, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
): MutationTuple<TData, TVariables> {
  const { navigate } = useNavigation<TabNavProp<'Home'>>();

  const onErrorDefault = (error: ApolloError) => {
    errorHandlerAlert(error, navigate);
  };

  const { ...others } = options ?? {};

  const {
    onError = errorAlert === 'SHOW_ALERT' ? onErrorDefault : undefined,
    ...otherOptions
  } = others;

  let [mutationFunction, mutationResult] = useMutationBase<TData, TVariables>(
    query,
    {
      onError,
      ...otherOptions,
    },
  );

  return [mutationFunction, mutationResult];
}
