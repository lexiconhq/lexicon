import { MutationHookOptions } from '@apollo/client';

import {
  UndoVotePollDocument,
  UndoVotePollMutationVariables,
  UndoVotePollMutation as UndoVotePollType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useUndoVotePoll(
  options?: MutationHookOptions<
    UndoVotePollType,
    UndoVotePollMutationVariables
  >,
) {
  const [undoVotePoll, { loading }] = useMutation<
    UndoVotePollType,
    UndoVotePollMutationVariables
  >(UndoVotePollDocument, {
    ...options,
  });

  return { undoVotePoll, loading };
}
