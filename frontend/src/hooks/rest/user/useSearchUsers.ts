import { QueryHookOptions } from '@apollo/client';

import {
  SearchUserDocument,
  SearchUserQueryVariables,
  SearchUserQuery as SearchUserType,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useQuery } from '../../../utils';

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
