import { MutationHookOptions } from '@apollo/client';

import {
  LeaveChannelDocument,
  LeaveChannelMutation as LeaveChannelType,
  LeaveChannelMutationVariables as LeaveChannelVariables,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useLeaveChannel(
  options?: MutationHookOptions<LeaveChannelType, LeaveChannelVariables>,
) {
  const [leaveChannel, { loading }] = useMutation<
    LeaveChannelType,
    LeaveChannelVariables
  >(LeaveChannelDocument, { ...options });

  return { leaveChannel, loading };
}
