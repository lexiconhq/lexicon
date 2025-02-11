import { QueryHookOptions } from '@apollo/client';

import {
  RepliedPostDocument,
  RepliedPostQueryVariables,
  RepliedPostQuery as RepliedPostType,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useQuery } from '../../../utils';

export function useReplyingTo(
  options?: QueryHookOptions<RepliedPostType, RepliedPostQueryVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    RepliedPostType,
    RepliedPostQueryVariables
  >(
    RepliedPostDocument,
    {
      ...options,
    },
    errorAlert,
  );

  return {
    data,
    loading,
    error,
    refetch,
    fetchMore,
  };
}
