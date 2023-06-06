import { LazyQueryHookOptions } from '@apollo/client';

import {
  RefreshTokenQuery,
  RefreshTokenDocument,
} from '../../generated/server';
import { ErrorAlertOptionType } from '../../types';
import { useLazyQuery } from '../../utils';

export function useRefreshToken(
  options?: LazyQueryHookOptions<RefreshTokenQuery>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [getRefreshToken, { data, error }] = useLazyQuery<RefreshTokenQuery>(
    RefreshTokenDocument,
    {
      ...options,
    },
    errorAlert,
  );

  return { getRefreshToken, data, error };
}
