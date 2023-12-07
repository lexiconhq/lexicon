import { MutationHookOptions } from '@apollo/client';

import {
  VotePollMutation as VotePollType,
  VotePollMutationVariables,
  VotePollDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useVotePoll(
  options?: MutationHookOptions<VotePollType, VotePollMutationVariables>,
) {
  const [votePoll, { loading }] = useMutation<
    VotePollType,
    VotePollMutationVariables
  >(VotePollDocument, {
    ...options,
  });

  return { votePoll, loading };
}
