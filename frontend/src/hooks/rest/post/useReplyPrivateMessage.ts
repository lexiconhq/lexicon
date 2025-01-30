import { MutationHookOptions } from '@apollo/client';

import {
  ReplyPrivateMessageDocument,
  ReplyPrivateMessageMutation as ReplyPrivateMessageType,
  ReplyPrivateMessageMutationVariables as ReplyPrivateMessageVariables,
} from '../../../generatedAPI/server';
import { useMutation } from '../../../utils';

export function useReplyPrivateMessage(
  options?: MutationHookOptions<
    ReplyPrivateMessageType,
    ReplyPrivateMessageVariables
  >,
) {
  const [reply, { loading }] = useMutation<
    ReplyPrivateMessageType,
    ReplyPrivateMessageVariables
  >(ReplyPrivateMessageDocument, { ...options });

  return { reply, loading };
}
