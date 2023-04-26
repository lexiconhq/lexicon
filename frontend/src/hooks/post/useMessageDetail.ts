import { QueryHookOptions } from '@apollo/client';

import {
  GetMessageDetailQuery,
  GetMessageDetailQueryVariables,
  GetMessageDetailDocument,
} from '../../generated/server';
import { ErrorAlertOptionType } from '../../types';
import { useQuery } from '../../utils';

export function useMessageDetail(
  options?: QueryHookOptions<
    GetMessageDetailQuery,
    GetMessageDetailQueryVariables
  >,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, fetchMore, refetch } = useQuery<
    GetMessageDetailQuery,
    GetMessageDetailQueryVariables
  >(GetMessageDetailDocument, { ...options }, errorAlert);

  return { data, loading, error, refetch, fetchMore };
}
