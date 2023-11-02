import { MutationHookOptions } from '@apollo/client';

import {
  LeaveMessageMutation as LeaveMessageType,
  LeaveMessageMutationVariables,
  LeaveMessageDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useLeaveMessage(
  options?: MutationHookOptions<
    LeaveMessageType,
    LeaveMessageMutationVariables
  >,
) {
  const [leaveMessage, { loading }] = useMutation<
    LeaveMessageType,
    LeaveMessageMutationVariables
  >(LeaveMessageDocument, {
    ...options,
  });

  return { leaveMessage, loading };
}
