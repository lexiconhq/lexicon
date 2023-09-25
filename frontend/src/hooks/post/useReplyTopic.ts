import { MutationHookOptions } from '@apollo/client';

import {
  ReplyTopicMutation as ReplyTopicType,
  ReplyTopicMutationVariables,
  ReplyTopicDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useReplyTopic(
  options?: MutationHookOptions<ReplyTopicType, ReplyTopicMutationVariables>,
) {
  const [reply, { loading }] = useMutation<
    ReplyTopicType,
    ReplyTopicMutationVariables
  >(ReplyTopicDocument, { ...options });

  return { reply, loading };
}
