import { LazyQueryHookOptions } from '@apollo/client';

import { RefreshToken } from '../../generated/server/RefreshToken';
import { REFRESH_TOKEN } from '../../graphql/server/refreshToken';
import { ErrorAlertOptionType } from '../../types';
import { useLazyQuery } from '../../utils';

export function useRefreshToken(
  options?: LazyQueryHookOptions<RefreshToken>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [getRefreshToken, { data, error }] = useLazyQuery<RefreshToken>(
    REFRESH_TOKEN,
    {
      ...options,
    },
    errorAlert,
  );

  return { getRefreshToken, data, error };
}
