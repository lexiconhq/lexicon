import { MutationHookOptions } from '@apollo/client';

import { votePollBodyBuilder } from '../../../api/bodyBuilder';
import {
  VotePollDocument,
  VotePollMutationVariables,
  VotePollMutation as VotePollType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useVotePoll(
  options?: MutationHookOptions<VotePollType, VotePollMutationVariables>,
) {
  const [votePollMutateFunc, { loading }] = useMutation<
    VotePollType,
    VotePollMutationVariables
  >(VotePollDocument, {
    ...options,
  });

  /**
   * This function wraps votePollMutateFunc to automatically add the voteBodyBuilder
   * variable each time votePoll is called, so users don't need to specify
   * voteBodyBuilder manually when calling the votePoll function.
   */
  const votePoll = (args: { variables: VotePollMutationVariables }) => {
    return votePollMutateFunc({
      ...args,
      variables: {
        ...args.variables,
        voteBodyBuilder: votePollBodyBuilder,
      },
    });
  };
  return { votePoll, loading };
}
