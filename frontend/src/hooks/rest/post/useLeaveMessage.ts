import { MutationHookOptions } from '@apollo/client';

import {
  LeaveMessageDocument,
  LeaveMessageMutationVariables,
  LeaveMessageMutation as LeaveMessageType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

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
