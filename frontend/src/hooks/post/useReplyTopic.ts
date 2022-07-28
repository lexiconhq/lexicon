import { MutationHookOptions } from '@apollo/client';

import {
  ReplyTopic as ReplyTopicType,
  ReplyTopicVariables,
} from '../../generated/server/Topics';
import { REPLY_TOPIC } from '../../graphql/server/topics';
import { useMutation } from '../../utils';

export function useReplyTopic(
  options?: MutationHookOptions<ReplyTopicType, ReplyTopicVariables>,
) {
  const [reply, { loading }] = useMutation<ReplyTopicType, ReplyTopicVariables>(
    REPLY_TOPIC,
    { ...options },
  );

  return { reply, loading };
}
