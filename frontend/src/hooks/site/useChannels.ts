import { QueryHookOptions, OperationVariables } from '@apollo/client';

import {
  GetChannelsQuery as ChannelsType,
  GetChannelsDocument,
} from '../../generated/server';
import { ErrorAlertOptionType } from '../../types';
import { useQuery } from '../../utils';

export function useChannels(
  options?: QueryHookOptions<ChannelsType>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error } = useQuery<ChannelsType, OperationVariables>(
    GetChannelsDocument,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error };
}
