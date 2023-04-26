import { QueryHookOptions } from '@apollo/client';

import {
  SearchUserQuery as SearchUserType,
  SearchUserQueryVariables,
  SearchUserDocument,
} from '../../generated/server';
import { ErrorAlertOptionType } from '../../types';
import { useQuery } from '../../utils';

export function useSearchUsers(
  options?: QueryHookOptions<SearchUserType, SearchUserQueryVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error } = useQuery<
    SearchUserType,
    SearchUserQueryVariables
  >(
    SearchUserDocument,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error };
}
