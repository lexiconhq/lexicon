import { MutationHookOptions } from '@apollo/client';

import {
  Reply as ReplyPostType,
  ReplyVariables as ReplyPostVariables,
} from '../../generated/server/Reply';
import { REPLY } from '../../graphql/server/reply';
import { useMutation } from '../../utils';

export function useReplyPost(
  options?: MutationHookOptions<ReplyPostType, ReplyPostVariables>,
) {
  const [reply, { loading }] = useMutation<ReplyPostType, ReplyPostVariables>(
    REPLY,
    { ...options },
  );

  return { reply, loading };
}
