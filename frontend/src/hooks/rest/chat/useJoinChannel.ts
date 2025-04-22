import { MutationHookOptions } from '@apollo/client';

import {
  JoinChannelDocument,
  JoinChannelMutation as JoinChannelType,
  JoinChannelMutationVariables as JoinChannelVariables,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useJoinChannel(
  options?: MutationHookOptions<JoinChannelType, JoinChannelVariables>,
) {
  const [joinChannelMutateFunc, { loading }] = useMutation<
    JoinChannelType,
    JoinChannelVariables
  >(JoinChannelDocument, { ...options });

  /**
   * Wraps `joinChannelMutateFunc` to automatically include `joinChannelInput`
   * as an empty object. This is necessary because Apollo Link REST does not
   * allow POST requests without a `body` key.
   */

  const joinChannel = (args: { variables: JoinChannelVariables }) => {
    return joinChannelMutateFunc({
      ...args,
      variables: {
        ...args.variables,
        joinChannelInput: {},
      },
    });
  };

  return { joinChannel, loading };
}
