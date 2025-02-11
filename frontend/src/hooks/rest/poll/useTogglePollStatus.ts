import { MutationHookOptions } from '@apollo/client';

import {
  TogglePollStatusDocument,
  TogglePollStatusMutationVariables,
  TogglePollStatusMutation as TogglePollStatusType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

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
