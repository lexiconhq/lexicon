import { MutationHookOptions } from '@apollo/client';

import {
  TogglePollStatusMutation as TogglePollStatusType,
  TogglePollStatusMutationVariables,
  TogglePollStatusDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useTogglePollStatus(
  options?: MutationHookOptions<
    TogglePollStatusType,
    TogglePollStatusMutationVariables
  >,
) {
  const [togglePollStatus, { loading }] = useMutation<
    TogglePollStatusType,
    TogglePollStatusMutationVariables
  >(TogglePollStatusDocument, {
    ...options,
  });

  return { togglePollStatus, loading };
}
