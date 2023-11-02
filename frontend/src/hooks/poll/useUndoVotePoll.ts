import { MutationHookOptions } from '@apollo/client';

import {
  UndoVotePollMutation as UndootePollType,
  UndoVotePollDocument,
  UndoVotePollMutationVariables,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useUndoVotePoll(
  options?: MutationHookOptions<UndootePollType, UndoVotePollMutationVariables>,
) {
  const [undoVotePoll, { loading }] = useMutation<
    UndootePollType,
    UndoVotePollMutationVariables
  >(UndoVotePollDocument, {
    ...options,
  });

  return { undoVotePoll, loading };
}
