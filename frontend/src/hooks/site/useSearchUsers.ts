import { QueryHookOptions } from '@apollo/client';

import {
  SearchUser as SearchUserType,
  SearchUserVariables,
} from '../../generated/server/SearchUser';
import { SEARCH_USER } from '../../graphql/server/search';
import { ErrorAlertOptionType } from '../../types';
import { useQuery } from '../../utils';

export function useSearchUsers(
  options?: QueryHookOptions<SearchUserType, SearchUserVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error } = useQuery<
    SearchUserType,
    SearchUserVariables
  >(
    SEARCH_USER,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error };
}
