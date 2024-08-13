import { QueryHookOptions } from '@apollo/client';

import {
  PluginStatusQuery as PluginStatusType,
  PluginStatusDocument,
} from '../../generated/server';
import { ErrorAlertOptionType } from '../../types';
import { useQuery } from '../../utils';

export function usePluginStatus(
  options?: QueryHookOptions<PluginStatusType>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, refetch } = useQuery<PluginStatusType>(
    PluginStatusDocument,
    {
      ...options,
    },
    errorAlert,
  );

  const { appleLoginEnabled, loginLinkEnabled } = data?.pluginStatus || {};

  return {
    appleLoginEnabled,
    loginLinkEnabled,
    loading,
    error,
    refetch,
  };
}
