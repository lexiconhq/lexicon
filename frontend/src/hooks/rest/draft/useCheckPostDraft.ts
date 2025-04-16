import { LazyQueryHookOptions } from '@apollo/client';

import {
  CheckPostDraftDocument,
  CheckPostDraftQueryVariables,
  CheckPostDraftQuery as CheckPostDraftType,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useLazyQuery } from '../../../utils';

export function useLazyCheckPostDraft(
  options?: LazyQueryHookOptions<
    CheckPostDraftType,
    CheckPostDraftQueryVariables
  >,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [checkPostDraft, { data, loading, error }] = useLazyQuery<
    CheckPostDraftType,
    CheckPostDraftQueryVariables
  >(
    CheckPostDraftDocument,
    {
      nextFetchPolicy: 'network-only',
      ...options,
    },
    errorAlert,
  );

  return { checkPostDraft, data, loading, error };
}
