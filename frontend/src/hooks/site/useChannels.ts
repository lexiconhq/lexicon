import { QueryHookOptions } from '@apollo/client';

import { GetChannels as ChannelsType } from '../../generated/server/Channels';
import { GET_CHANNELS } from '../../graphql/server/channels';
import { ErrorAlertOptionType } from '../../types';
import { useQuery } from '../../utils';

export function useChannels(
  options?: QueryHookOptions<ChannelsType>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error } = useQuery<ChannelsType>(
    GET_CHANNELS,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error };
}
