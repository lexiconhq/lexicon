import { QueryHookOptions } from '@apollo/client';

import { topicsDetailPathBuilder } from '../../../api/pathBuilder';
import {
  GetMessageDetailDocument,
  GetMessageDetailQuery,
  GetMessageDetailQueryVariables,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useQuery } from '../../../utils';

export function useMessageDetail(
  options?: QueryHookOptions<
    GetMessageDetailQuery,
    GetMessageDetailQueryVariables
  >,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  let variables = options && options.variables;

  if (variables) {
    const messageDetailPath = topicsDetailPathBuilder;

    variables = { ...variables, messageDetailPath };
  }

  const { data, loading, error, fetchMore, refetch } = useQuery<
    GetMessageDetailQuery,
    GetMessageDetailQueryVariables
  >(GetMessageDetailDocument, { ...options, variables }, errorAlert);

  return { data, loading, error, refetch, fetchMore };
}
