import { LazyQueryHookOptions } from '@apollo/client';

import { postDraftPathBuilder } from '../../../api/pathBuilder';
import {
  ListPostDraftsDocument,
  ListPostDraftsQueryVariables,
  ListPostDraftsQuery as ListPostDraftsType,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useLazyQuery } from '../../../utils';

export function useListPostDrafts(
  options?: LazyQueryHookOptions<
    ListPostDraftsType,
    ListPostDraftsQueryVariables
  >,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [
    getListPostDraftFunc,
    { data, loading, error, networkStatus, refetch, fetchMore },
  ] = useLazyQuery<ListPostDraftsType, ListPostDraftsQueryVariables>(
    ListPostDraftsDocument,
    {
      ...options,
      variables: {
        postDraftPath: postDraftPathBuilder,
        page: options?.variables?.page ?? 1,
        ...options?.variables,
      },
      fetchPolicy: 'network-only',
    },
    errorAlert,
  );

  const getListPostDraft = (args: {
    variables: ListPostDraftsQueryVariables;
  }) => {
    return getListPostDraftFunc({
      ...args,
      variables: {
        ...args.variables,
        postDraftPath: postDraftPathBuilder,
      },
    });
  };

  return {
    getListPostDraft,
    data,
    loading,
    error,
    networkStatus,
    refetch,
    fetchMore,
  };
}
