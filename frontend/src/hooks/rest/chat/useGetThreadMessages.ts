import {
  LazyQueryHookOptions,
  QueryHookOptions,
  useLazyQuery,
} from '@apollo/client';

import { threadMessagesPathBuilder } from '../../../api/pathBuilder';
import {
  GetThreadMessagesDocument,
  GetThreadMessagesQuery as GetThreadMessagesType,
  GetThreadMessagesQueryVariables as GetThreadMessagesVariable,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useQuery } from '../../../utils';

export function useGetThreadMessages(
  options?: QueryHookOptions<GetThreadMessagesType, GetThreadMessagesVariable>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  let variables = options && options.variables;

  if (variables) {
    const getThreadMessagesPath = threadMessagesPathBuilder;

    variables = { ...variables, getThreadMessagesPath };
  }

  const resultQuery = useQuery<
    GetThreadMessagesType,
    GetThreadMessagesVariable
  >(GetThreadMessagesDocument, { ...options, variables }, errorAlert);

  return resultQuery;
}

export function useLazyGetThreadMessages(
  options?: LazyQueryHookOptions<
    GetThreadMessagesType,
    GetThreadMessagesVariable
  >,
) {
  const [getThreadMessagesMutateFunc, { ...other }] = useLazyQuery<
    GetThreadMessagesType,
    GetThreadMessagesVariable
  >(GetThreadMessagesDocument, {
    context: { queryDeduplication: true },
    ...options,
  });

  const getThreadMessages = (args: {
    variables: GetThreadMessagesVariable;
  }) => {
    return getThreadMessagesMutateFunc({
      ...args,
      variables: {
        ...args.variables,
        getThreadMessagesPath: threadMessagesPathBuilder,
      },
    });
  };

  return {
    getThreadMessages,
    ...other,
  };
}
