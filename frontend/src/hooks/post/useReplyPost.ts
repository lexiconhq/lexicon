import { MutationHookOptions } from '@apollo/client';

import {
  ReplyMutation as ReplyPostType,
  ReplyMutationVariables as ReplyPostVariables,
  ReplyDocument,
} from '../../generated/server';
import { useMutation } from '../../utils';

export function useReplyPost(
  options?: MutationHookOptions<ReplyPostType, ReplyPostVariables>,
) {
  const [reply, { loading }] = useMutation<ReplyPostType, ReplyPostVariables>(
    ReplyDocument,
    { ...options },
  );

  return { reply, loading };
}
