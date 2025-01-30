import { MutationHookOptions } from '@apollo/client';

import {
  ReplyTopicDocument,
  ReplyTopicMutationVariables,
  ReplyTopicMutation as ReplyTopicType,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useReplyTopic(
  options?: MutationHookOptions<ReplyTopicType, ReplyTopicMutationVariables>,
) {
  const [replyMutateFunc, { loading, error }] = useMutation<
    ReplyTopicType,
    ReplyTopicMutationVariables
  >(ReplyTopicDocument, { ...options });

  const reply = (args: { variables: ReplyTopicMutationVariables }) => {
    return replyMutateFunc({
      ...args,
      variables: {
        replyInput: {
          ...args.variables.replyInput,
          archetype: 'regular',
        },
      },
    });
  };

  return { reply, loading, error };
}
